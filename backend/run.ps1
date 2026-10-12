$env:Path = "$HOME\.dotnet;" + $env:Path
$env:DOTNET_ROOT = "$HOME\.dotnet"
dotnet run --project "$PSScriptRoot\backend.csproj" @args
