# libraryapp
A restful webservice built with mongo database express and node. The OTP mechanism is used in the registration process. After successful registration,A user can authenticate with their credentials. The authentication endpoint returns a token if the credentials provided by the user are correct. Included in the payload of the token is the user's role which determines the authority of the user to carry out an operation on the server. the admin user can upload a book, delete a book, get a book by its ISBN, tittle or category where as a student user can perform operations such as getting a book by its IBSN, title or author. A cloud storage service is used in storing the books(files) and the link generated is stored in the mongo database
