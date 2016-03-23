# putio_client

I'd suggest you use Docker for this.

````
git clone https://github.com/OmgImAlexis/putio_client.git && cd putio_client
echo "{}" >> config.json
npm install
docker run -d -p 3000:3000 \
    -v "$PWD":/app \
    -w /app \
    mhart/alpine-node node app.js
````

If you're running this on UNRAID then SSH into the machine and run this instead of the Docker command.
Make sure the repo is cloned into `/mnt/user/appdata/putio_client/`.
````
/usr/local/emhttp/plugins/dynamix.docker.manager/scripts/docker run -d --name="putio"  -w /app --net="bridge" -p 3000:3000/tcp -v "/mnt/user/appdata/putio_client/":"/app":rw mhart/alpine-node node app.js
````

From here you should now be able to open Sickrage(/config/search/) and select uTorrent as the torrent downloader.
Make sure to use the IP for the machine running Docker. If you're using this on OSX run `docker-machine ip default` to get the Docker IP.

![Sickrage](http://i.imgur.com/JXoeC5i.png)
