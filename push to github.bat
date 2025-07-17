@echo off
cd /d C:\Users\Administrator\Desktop\playful-hedgehog-bounce

echo.
echo === Adding all files to Git ===
git add .

echo.
set /p msg="Enter commit message: "
git commit -m "%msg%"

echo.
echo === Pushing to GitHub ===
git push origin main --force

echo.
echo ✅ Done! Your project is now on GitHub.
pause
