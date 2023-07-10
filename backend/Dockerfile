# pull official base image
FROM python:3.9.6-alpine

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN apk update \
  # psycopg2 dependencies
  && apk add --virtual build-deps gcc python3-dev musl-dev \
  && apk add postgresql-dev \
  # Pillow dependencies
  && apk add jpeg-dev zlib-dev freetype-dev lcms2-dev openjpeg-dev tiff-dev tk-dev tcl-dev \
  # CFFI dependencies
  && apk add libffi-dev py-cffi \
  # Translations dependencies
  && apk add gettext \
  # heroku dependency
  && apk add curl openssh bash make \
    # mimetypes
  && apk add mailcap \
  # https://docs.djangoproject.com/en/dev/ref/django-admin/#dbshell
  && apk add postgresql-client \
  && apk add git \
  && pip install --upgrade pip

COPY ./requirements.txt .
RUN pip3 install -r requirements.txt

# copy project
COPY . .

# copy entrypoint.sh
COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

COPY ./flower/start ./start-flower
RUN sed -i 's/\r$//g' /usr/src/app/start-flower
RUN chmod +x /usr/src/app/start-flower

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]