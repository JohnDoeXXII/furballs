# furballs
Web Application for handling needs of Animal Shelters

# Dev Notes

Dev Env Required Installations
-----------------------
	Server
		Java25 jdk
		DB		- https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
		jdbc?	- (got from DB)
		flyway  - https://www.red-gate.com/products/flyway/community/
		Maven 	- https://maven.apache.org/download.cgi
	
	Client
		Node	- https://nodejs.org/en/download


    Test Curls
	    curl -H "Content-Type: application/json" -X POST "http://localhost:8080/animals" -d "{\"name\":\"dog\"}"
		