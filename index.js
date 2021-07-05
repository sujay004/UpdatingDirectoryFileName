var os = require('os');
if (os.platform() == 'win32') {
    if (os.arch() == 'ia32') {
        console.log("windows 32")
        var chilkat = require('@chilkat/ck-node12-win-ia32');
    } else {
        console.log("windows 64")
        var chilkat = require('@chilkat/ck-node12-win64');
    }
} else if (os.platform() == 'linux') {
    if (os.arch() == 'arm') {
        var chilkat = require('@chilkat/ck-node12-arm');
    } else if (os.arch() == 'x86') {
        var chilkat = require('@chilkat/ck-node12-linux32');
    } else {
        var chilkat = require('@chilkat/ck-node12-linux64');
    }
} else if (os.platform() == 'darwin') {
    var chilkat = require('@chilkat/ck-node12-macosx');
}

function chilkatExample() {
    // This example requires the Chilkat API to have been previously unlocked.
    // See Global Unlock Sample for sample code.

    var http = new chilkat.Http();

    // Use your previously obtained access token here:
    // See the following examples for getting an access token:
    //    Get Microsoft Graph OAuth2 Access Token (Azure AD v2.0 Endpoint).
    //    Get Microsoft Graph OAuth2 Access Token (Azure AD Endpoint).
    //    Refresh Access Token (Azure AD v2.0 Endpoint).
    //    Refresh Access Token (Azure AD Endpoint).

    // (Make sure your token was obtained with the FilesRead or Files.ReadWrite scope.)
    http.AuthToken = "MICROSOFT_GRAPH_ACCESS_TOKEN";

    // Sends the following GET request:
    // GET https://graph.microsoft.com/v1.0/me/drive/root:/{item-path}:/content

    // Make sure to automatically follow redirects
    http.FollowRedirects = true;

    // This example will download /Misc/wildlife/penguins.jpg
    http.SetUrlVar("item_path","Misc/wildlife/penguins.jpg");

    // Stream the response body directly to a local file.
    var localPath = "qa_output/penguins.jpg";

    var success = http.Download("https://graph.microsoft.com/v1.0/me/drive/root:/{$item_path}:/content",localPath);
    if (http.LastMethodSuccess !== true) {
        console.log(http.LastErrorText);
        return;
    }

    // If the response status code was not 200, then it failed.
    if (http.LastStatus !== 200) {
        console.log("Response Status Code = " + http.LastStatus);
        console.log("Failed.");
        return;
    }

    // If we got here, then the file was successfully downloaded.
    console.log("Download from OneDrive successful.");

}
console.log("running");

chilkatExample();