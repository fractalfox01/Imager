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

     http://imager.glitch.me/?q=Pistachio&offset=3
     
#### Expected output:

    {"0": 
    {
    "Url": "https://www.howsweeteats.com/wp-content/uploads/2018/03/pistachio-carrot-cake-I-howsweeteats.com-19.jpg",
    "Snippet": "Mar 23, 2018 ... This carrot cake is super fun and a twist on the classic because it has chopped \nroasted pistachios in both the cake AND the frosting! Topped ...",
    "Link": "https://www.howsweeteats.com/2018/03/carrot-cake-pistachio/",
    "Thumbnail": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSOKyXEL8-aUzzDWgguyxA3SuqTJFlz3A8DOe_uqqNuH6BH0y1i9sFZZJAP" },...

## Testing Example:

returns **ONE** result per query. ( multiple of *1* ), displays indexed image 3.

     http://imager.glitch.me/test?q=panda&offset=3

