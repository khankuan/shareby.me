# Shareby.me

## Description
This repo is a src dump of [shareby.me](https://shareby.me). This project demo the use of [Audiosign](https://github.com/khankuan/audiosign) and [Temasys Skylink](https://github.com/Temasys/SkylinkJS).

### What it does
- `Host` Drop files you want to share.
- `Host` Creates a [Skylink](https://github.com/Temasys/SkylinkJS) room automatically.
- `Host` A high-freq sound will be emitted using [Audiosign](https://github.com/khankuan/audiosign). This is the room id.
- `Client` Other party nearby goes to the same site (accepts mic permissions).
- `Client` Other party picks up the high-freq sound (room id).
- `Client` Other party joins room.
- `Client` Tell host to requests for file list.
- `Host` Sends file list.
- `Client` Display file list.
- `Client` Click on file to download.
- `Client` Tell host to request for file data.
- `Host` Sends file blob.
- `Client` Pack file and downloads.
