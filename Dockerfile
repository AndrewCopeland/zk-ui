FROM ubuntu:latest
RUN apt-get update && apt-get install \
  -y --no-install-recommends python3 python3-virtualenv python3-dev build-essential libssl-dev libffi-dev python3-setuptools

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m virtualenv --python=/usr/bin/python3 $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install dependencies:
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY serve.py .
COPY templates templates
COPY static static
COPY wsgi.py .
COPY zk.py .

# Run the application:
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]
