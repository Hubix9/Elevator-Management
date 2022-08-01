<script>
        import axios from "axios"
        import { onMount } from "svelte"

        let elevators = []
        let highestFloor
        let lowestFloor
        let selectedElevatorId
        let selectedFloor
        let scheduleOffset

        onMount(async () => {
                let result = await axios.get("/config")
                elevators = result.data.elevators
                highestFloor = Math.max.apply(
                        Math,
                        elevators.map(function (obj) {
                                return obj.highestFloor
                        })
                )
                lowestFloor = Math.min.apply(
                        Math,
                        elevators.map(function (obj) {
                                return obj.lowestFloor
                        })
                )
                for (let elevator of elevators) {
                        elevator.currentFloor = elevator.lowestFloor > 0 ? elevator.lowestFloor : 0
                        elevator.targetFloor = null
                        elevator.scheduledFloors = []
                }
        })
        setInterval(async () => {
                for (let elevator of elevators) {
                        let result = await axios.get(`/status?id=${elevator.id}`)
                        let scheduledFloors = await axios.get(`/scheduledFloors?id=${elevator.id}`)
                        elevator.currentFloor = result.data.currentFloor
                        elevator.targetFloor = result.data.targetFloor
                        elevator.scheduledFloors = scheduledFloors.data
                }
                // Trigger svelte object update
                elevators = elevators
        }, 1000)

        function handleSelectButtons(id) {
                selectedElevatorId = id
        }

        async function scheduleFloor() {
                try {
                        await axios.post(`/schedule`, {
                                id: selectedElevatorId,
                                targetFloor: selectedFloor,
                        })
                } catch (err) {
                        alert(err.response.data)
                }
        }

        async function scheduleFloorWithOffset() {
                try {
                        await axios.post(`/scheduleWithOffset`, {
                                id: selectedElevatorId,
                                targetFloor: selectedFloor,
                                offset: scheduleOffset,
                        })
                } catch (err) {
                        alert(err.response.data)
                }
        }

        async function unscheduleFloor() {
                try {
                        await axios.post(`/unschedule`, {
                                id: selectedElevatorId,
                                targetFloor: selectedFloor,
                        })
                } catch (err) {
                        alert(err.response.data)
                }
        }
        function* range(start, end) {
                yield start
                if (start == end) return
                yield* start < end ? range(start + 1, end) : range(start - 1, end)
        }
</script>

<main>
        <h1>Elevator Management</h1>

        {#each elevators as elevator}
                <div style="overflow-x:auto; display: inline-block">
                        <div style="margin-left: 5%;">
                                {`elevator id: ${elevator.id}`}
                        </div>
                        <table class="container">
                                {#each [...range(highestFloor, lowestFloor)] as i}
                                        {#if i <= elevator.highestFloor && i >= elevator.lowestFloor}
                                                <tr
                                                        class="cell"
                                                        id={i.toString()}
                                                        style="{i == elevator.currentFloor
                                                                ? 'background: green;'
                                                                : i == elevator.targetFloor
                                                                ? 'background: yellow;'
                                                                : elevator.scheduledFloors.includes(i)
                                                                ? 'background: orange;'
                                                                : 'background: white;'}; user-select: none"
                                                >
                                                        {i}
                                                </tr>
                                        {:else}
                                                <tr class="cell" id={i.toString()} style="background: black; user-select: none"> X </tr>
                                        {/if}
                                {/each}
                        </table>
                        <div style="margin-left: 25%;">
                                <button on:click={() => handleSelectButtons(elevator.id)}>select</button>
                        </div>
                </div>
        {/each}
        {#if selectedElevatorId != undefined}
                <div class="card">
                        <div style="display: inline-block;">
                                <h2 style="display: inline;">Control panel</h2>
                                <h3>Selected elevator id: {selectedElevatorId}</h3>
                                <label for="floors">Select a floor</label>
                                <select name="floors" id="floors" bind:value={selectedFloor}>
                                        {#each [...range(elevators[selectedElevatorId].highestFloor, elevators[selectedElevatorId].lowestFloor)] as i}
                                                <option value={i}>{i}</option>
                                        {/each}
                                </select>
                        </div>
                        <div style="display: inline-block; margin-top: 0%" />
                        <h3>Operations:</h3>
                        <div style="display: inline-block">
                                <button on:click={scheduleFloor}>Schedule</button>
                                <div style="display: inline-block;">
                                        <button on:click={scheduleFloorWithOffset}>Schedule with offset</button>
                                        <input
                                                bind:value={scheduleOffset}
                                                title="offset value"
                                                type="number"
                                                min="0"
                                                max={elevators[selectedElevatorId].highestFloor - elevators[selectedElevatorId].lowestFloor}
                                        />
                                </div>
                                <button on:click={unscheduleFloor}>Unschedule</button>
                        </div>
                </div>
        {/if}
</main>

<style>
        .container {
                background: black;
                display: inline-block;
                border: 5px solid black;
                margin: 5px;
        }
        .cell {
                justify-content: center;
                align-items: center;
                display: flex;
                font-family: Arial;
                font-size: 3rem;
                font-weight: bold;
                background: white;
                width: 80px;
                border: 2px solid black;
        }
        .card {
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
                transition: 0.3s;
        }
        .card:hover {
                box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
        }
</style>
