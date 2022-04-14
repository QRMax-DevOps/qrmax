Note:
 The "helpers" folder contains middleware utilities for generating request data (bodies, headers, methods, etc.).
 These utility files will be full of switch cases.

Common arguments used in functions:

      - Any "url parameters" described are usually produced automatically
        by the login screen upon successful login.
        *UPDATE UPDATE UPDATE!*
        "url parameters" are deprecated and no longer in use. This data is
        now stored in Session Data.

     - target: 'COMPANYACCOUNT', 'STOREACCOUNT', 'DISPLAY', etc. Used in the "settings"
                middleware to determine where you want to get the settings from.

     - url: Where is the server being hosted?
		   > Usually http://localhost:80 (localhost) or http://3.25.134.204
		   > Url parameters to help with this, e.g. : "islocalhost=80"

     - id: As of 02/03, simply just the username of the logged in user.
		   > Url parameter, e.g. : "username=usernamehere"
 
     - type: The type of request being made. Refer to the switch-case in the function.

     - data: An object which can hold the following values:
		   > tore: As of 02/03, simply just provide the store name.
		   > company: As of 02/03, simply just provide the company name.
		   > display: As of 02/03, simply just provide the display name.
		   > fields: Fields to be updated. Array type.
		   > values: Values to be updated, must align with fields. Array type.

     - global: Excuse the name. This is basically the object which stores
       the response from the API and, hopefully, the database if all goes
       well.
		   > Should be a length=2 array.
		   > First value is either true or false, determining whether the request
		     was successful.
		   > Second value is the actual data or message. If a successful request,
          	     this should be a JSON.

