# putio_client

This is a fork of OmgImAlexis' put.io utorrent proxy client node app. Wow that
was a mouthful...

I modified this to work with sonarr in particular, and have no idea if it'll
work with sickrage still (although I have no reason to believe it doesn't).
Also haven't tested with unraid... Honestly, Omg's repo was seemingly
abandoned, so I just made this work for myself.

I'd suggest you use Docker for this.

````
git clone https://github.com/cvockrodt/putio_client.git && cd putio_client
cp config.example.json config.json
docker build . -t putio_client
docker run -d -p 3000:3000 \
    -v "config.json":/app/config.json \
    putio_client
````

You'll need to open the config.json and replace `MY_PUTIO_TOKEN` with your
Put.io API token you can get that [here](https://put.io/v2/oauth2/register).
Just fill in the details and copy the "Oauth Token" from the page after you
submit the form.

From here you should now be able to open Sonarr and select uTorrent as the
torrent downloader.
Make sure to use the IP for the machine running Docker. If you're using this
on OSX run `docker-machine ip default` to get the Docker IP.

