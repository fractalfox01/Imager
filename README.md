# An Image Abstraction Microservice

---

*created  by Tommy V*

---

## Basic use:

Allows user to perform image lookups through the url.

Accepts two parameters,

##### query:  `q=<your query word/phrase>` 

And 

##### offset:  `offset=<Integer type here>`

The offset parameter moves the index start over in multiples of ten.

## Example:

returns **TEN** result per query. ( multiple of *10* ), displays indexed images 30 - 39.

   ~~http://imager.glitch.me/?q=panda&offset=3~~

## Testing Example:

returns **ONE** result per query. ( multiple of *1* ), displays indexed image 3.

     http://imager.glitch.me/test?q=panda&offset=3

