cmake_minimum_required(VERSION 3.10)
project(phash_bouncer)

# We use C++ 17 for compatibility with httplib
set(CMAKE_CXX_STANDARD 17)

# Find the PostgreSQL/pqxx libraries we installed via apt-get
find_package(PkgConfig REQUIRED)
pkg_check_modules(PQXX REQUIRED libpqxx)

# Compile main.cpp into an executable called phash_bouncer
add_executable(phash_bouncer main.cpp)

# Link the libraries and headers so IntelliSense stops complaining
target_link_libraries(phash_bouncer ${PQXX_LIBRARIES})
target_include_directories(phash_bouncer PUBLIC ${PQXX_INCLUDE_DIRS})