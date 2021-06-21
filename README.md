# floop


# Instructions for running floop with Docker


Create a file named `.env` with the contents:

```
APPLICATION_PWD=A_PASSWORD_FOR_USERS_TO_TYPE
FREESOUND_API_KEY=YOUR_FREESOUND_API_KEY
```

Then run:

```
docker-compose up
```

And point your browser (chrome) to `localhost:8080/floop/`