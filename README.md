# Videofx SAMMI Extension

This extension gives you a custom command to play video files on your computer through an OBS browser source.

## Setup

https://github.com/user-attachments/assets/77ac4930-b6b1-410f-95d7-6c803c2a67e1

### SAMMI Extension

1. Extract `videofx.zip` anywhere convenient for yourself.
2. Open OBS Studio.
3. Open SAMMI Core. On the left menu buttons, click on SAMMI Bridge > Open in a browser
   - Note: this is useful for setting up the extension but it's recommended to [properly set up the bridge in your OBS dock](https://sammi.solutions/docs/getting-started/step-by-step#addbridgetoyourobsdock).
4. Go back to SAMMI Core. On the left menu buttons, click on SAMMI Bridge > Install an Extension.
   - Find where you extracted `videofx.zip` and go to it.
   - Find `videofx-extension.sef`, select, and open it.
5. Back in SAMMI Core, you will now see a new deck called "Videofx Player". Inside it, you will see a sample button using the custom extension command `Play Video` with a field `Video File Path (Relative to Browser Source)`. This is how you play videos on the browser source.
6. Go to your bridge. You should now be able to see a new extension tab `Videofx`. If you click on it, you will be able to specify your OBS WebSocket address and password if you changed the defaults.
   - These details can be found in OBS Studio > Tools > WebSocket Server Settings.
   - If the status circle is green, you've successfully connected the extension to OBS.
   - Otherwise, you can enter your details and press "Reconnect".

### OBS Browser Source

7. Go to your OBS Studio.
8. Create a new Browser source
   - Name it something convenient for yourself.
   - Check the "Local file" checkbox and browse to where you extracted `videofx.zip`.
   - Find `index.html`, select it, and open it.
   - You may make the browser source whatever size fits your needs, but be aware that videos which don't take up the entire space will be centered in the browser source.
     - It could be useful to make the browser source fit your screen, then manually scaled down to what you need on your OBS scene.
   - Click OK.
   - If you see the loading dialogue and no errors, then you've successfully connected the browser source to OBS.
     - If there was a connection error, edit your connection settings inside `settings.js`, save, and refresh the browser source.
9. Test the browser source with the `Video Player` deck by going into the test button and clicking `Run`.

## Adding more videos

NOTE: This browser source uses the HTML video tag, which can only support `.mp4`, `.webm`, and `.ogg` video types.

NOTE: Only the `.webm` video file supports an alpha channel (transparency). If you wish to have transparency using `.mp4` or `.ogg` you will need to manually add a chroma key to the browser source.

To add more videos, put them into the `videos` folder in your extracted `videofx` folder.
