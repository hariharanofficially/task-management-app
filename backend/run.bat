@echo off
set "PATH=%USERPROFILE%\.dotnet;%PATH%"
dotnet run --project "%~dp0backend.csproj" %*
