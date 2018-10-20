# Check PowerShell version is high enough to run the script
if ($PSVersionTable.PSVersion.Major -le 4)
{
    Write-Host " Requires Windows 10 and PowerShell 5.1 or higher"
    Break
}

# List of addresses to check for latency
$LatencyAddresses = [ordered]@{
    AussieBB_DNS = @{
        Address = '202.142.142.142'
    }
    Google = @{
        Address = 'google.com'
    }
    Facebook = @{
        Address = 'facebook.com'
    }
    Reddit = @{
        Address = 'reddit.com'
    }
}

# The number of echo Request messages to send
$EchoRequests = 20

# List of download addresses
$SpeedAddresses = [ordered]@{
    Cloudflare = @{
        Address        = 'images.ozspeedtest.com'
        DownloadFile   = 'images/grass_15mb.jpg'
        Prefix         = 'https'
    }
}

# Add support for TLS 1.2 so https works.
[System.Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Get the time now
$DateTime = get-Date -format "dd/MM/yyy HH:mm zzz"

$UANTVersion = "1.0.0"
$webContent = Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/ChrisRiddell/U-ANT/master/.uantversion'

if($webContent.Content -notlike $UANTVersion)
{
    Write-Host "                   An Update is available for U-ANT                   " -BackgroundColor Black -ForegroundColor Red
}

# Title
Write-Host "                                                                      " -BackgroundColor green -ForegroundColor White
Write-Host "                             U-ANT $($UANTVersion)                              " -BackgroundColor green -ForegroundColor White
Write-Host "                                                                      " -BackgroundColor green -ForegroundColor White
Write-Host "                                                                      " -BackgroundColor red -ForegroundColor White
Write-Host "              This can take a while. Please be patient,               " -BackgroundColor red -ForegroundColor White
Write-Host "           you will be prompted once the test has completed           " -BackgroundColor red -ForegroundColor White
Write-Host "                                                                      `n" -BackgroundColor red -ForegroundColor White

# Start the whirlcode var with a code string
$LatencyWhirlCode = "$ "

# Start the Discord var with a code string
$LatencyDiscord = "``````"

# Perform latency test
foreach ($LatencyName in $LatencyAddresses.Keys) {
    [hashtable]$Server = $LatencyAddresses[$LatencyName]

    Write-Host " Testing connection to $($LatencyName.replace('_' , ' '))" -ForegroundColor DarkGreen

    # Test and sent the output
    $TestConnection = Test-Connection $Server.Address -Count $EchoRequests
    $MeasureResults = $TestConnection | Measure-Object -Property ResponseTime -Average -Minimum -Maximum
    
    Write-Host " Average Latency: $([math]::Round($MeasureResults.Average))ms | Packets Received: $($TestConnection.Count) | Packets Lost: $($EchoRequests-$TestConnection.Count) " -ForegroundColor White

    # Add whirlcode
    $LatencyWhirlCode = $LatencyWhirlCode + "[*[``$($Server.Address)``]*] `n"
    $LatencyWhirlCode = $LatencyWhirlCode + "[``Average Latency ``][*[""$([math]::Round($MeasureResults.Average))ms""]*] | [``Packets Received ``][*[""$($TestConnection.Count)""]*] | [``Packets Lost ``][*[""$($EchoRequests-$TestConnection.Count)""]*] `n"

    # Add Discord code
    $LatencyDiscord = $LatencyDiscord + "$($Server.Address)`n"
    $LatencyDiscord = $LatencyDiscord + "Average Latency $([math]::Round($MeasureResults.Average))ms | Packets Received $($TestConnection.Count) | Packets Lost $($EchoRequests-$TestConnection.Count) `n"
}

# Add blank row to console
Write-Host ""

# Use WebClient for the download
$webClient = New-Object System.Net.WebClient

# Start the whirlcode var with a code string and new line
$SpeedWhirlCode = "$ `n"

# Start the Discord var
$SpeedDiscord = ""

# Perform speed test
foreach ($SpeedTestLocation in $SpeedAddresses.Keys) {
    $Server = $SpeedAddresses[$SpeedTestLocation]

    # Build the full URL
    $url = "$($Server.Prefix)://$($Server.Address)/$($Server.DownloadFile)"

    Write-Host " Running speedtest" -ForegroundColor DarkGreen

    try {

        # Get the size of the file
        $webClient.OpenRead($url) | Out-Null
        $filesize = $webClient.ResponseHeaders["Content-Length"]
        $filesizeInMB = ($filesize / 1Mb)

        # Get the current date/time so we can count how many seconds it takes to download the test file
        $StartTime = Get-Date

        # Download the test file
        $TMP = $webClient.DownloadData($url)

        # Get the current date/time and subtract the starting date/time and get the total seconds
        $EndTime = (Get-Date).Subtract($StartTime).totalseconds

        # Convert the time it took the file to download into Mbps and save the results
        $SpeedInMbps = (($filesizeInMB / $EndTime) * 8);
        
        Write-Host " Speed: $([math]::Round($SpeedInMbps,2))Mbps | File Size: $([math]::Round($filesizeInMB,2))MB " -ForegroundColor White

        # Add Whirlcode
        $SpeedWhirlCode = $SpeedWhirlCode + "[*[``$($SpeedTestLocation) ``]*] `n"
        $SpeedWhirlCode = $SpeedWhirlCode + "[``Average Speed ``][*[""$([math]::Round($SpeedInMbps,2))Mbps""]*] `n"

        # Add Discord code
        $SpeedDiscord = $SpeedDiscord + "$($SpeedTestLocation) `n"
        $SpeedDiscord = $SpeedDiscord + "Average Speed $([math]::Round($SpeedInMbps,2))Mbps `n"

    } catch [Net.WebException] {
        Write-Host " Failed " -ForegroundColor DarkRed

        # Add Whirlcode for fail
        $SpeedWhirlCode = $SpeedWhirlCode + "[*[``$($SpeedTestLocation) ``]*] `n"
        $SpeedWhirlCode = $SpeedWhirlCode + "[*[""Failed""]*] `n"
        
        # Add Discord code for fail
        $SpeedDiscord = $SpeedDiscord + "$($SpeedTestLocation) `n"
        $SpeedDiscord = $SpeedDiscord + "Failed `n"
    }
}

# Ask if we want to copy the whirlcode to clipboard
[string]$End = Read-Host -Prompt "`n Clipboard results? 1 = Whirlpool, 2 = Discord"

if($End -eq "1") {
    # Add whirlcode to clipboard
    Set-Clipboard -Value $LatencyWhirlCode
    Set-Clipboard -Value $SpeedWhirlCode -Append
    Set-Clipboard -Value "$ " -Append
    Set-Clipboard -Value "[([``Test run on ``][*[""$($DateTime)""]*][`` using U-ANT and Oz Broadband Speed Test``])]" -Append
} elseif($End -eq "2") {
    # Add whirlcode to clipboard
    Set-Clipboard -Value $LatencyDiscord
    set-Clipboard -Value $SpeedDiscord -Append
    Set-Clipboard -Value "Test run on $($DateTime) using U-ANT and Oz Broadband Speed Test``````" -Append
} else {
    # fin
}