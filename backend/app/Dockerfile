FROM python:3.11.7

WORKDIR /usr/src/app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install -y default-libmysqlclient-dev

RUN apt-get update && \
    apt-get install pkg-config && \
    apt-get install -y default-libmysqlclient-dev && \
    pip install fastapi uvicorn sqlalchemy mysqlclient

RUN pip install fastapi[all] pytest httpx

COPY . .

ENV PYTHONPATH "${PYTHONPATH}:/app"

CMD ["gunicorn", "main:app", "-c", "gunicorn.conf.py"]
