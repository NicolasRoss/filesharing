FROM python:3.6


# ENV VIRTUAL_ENV=/opt/venv
# RUN python3 -m venv $VIRTUAL_ENV
# ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install dependencies:
COPY . .
RUN pip install -r requirements.txt

# Run the application:
# COPY . .
EXPOSE 5000
CMD ["python", "main.py"]



# ENTRYPOINT ["python"]

# CMD ["main.py"]
