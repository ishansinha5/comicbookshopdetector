FROM ubuntu:24.04

# Install the necessary build tools and PostgreSQL C++ connectors
RUN apt-get update && apt-get install -y \
    g++ cmake make \
    libpqxx-dev libpq-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy our C++ source code and CMakeLists.txt
COPY . .

# Compile the executable
RUN mkdir build && cd build && cmake .. && make

EXPOSE 8081

# Run the compiled bouncer
CMD ["./build/phash_bouncer"]