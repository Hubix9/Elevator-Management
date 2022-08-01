mkdir Bundle
cd Backend
call npm run build
cd ..
cd Frontend
call npm run build
cd ..
robocopy Backend\dist Bundle\dist /e
robocopy Backend\config Bundle\config /e
robocopy Backend\node_modules Bundle\dist\node_modules /e
robocopy Frontend\dist Bundle\dist\www /e