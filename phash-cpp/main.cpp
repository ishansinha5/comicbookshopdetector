#include <iostream>
#include <string>
#include "httplib.h"
#include <pqxx/pqxx>
// #include <opencv2/opencv.hpp> // Will be used for the actual pHash algorithm later

using namespace std;

// connecting to our local wsl postgis instance. keeping the credentials hardcoded 
// just for this dev phase before we move to a secure .env file.
const string DB_CONN_STR = "postgresql://admin:enterprise_secure@db:5432/comicdb";

string calculate_phash(const string& image_data) {
    // a placeholder for the actual perceptual hashing logic.
    // this will eventually convert pixels to a 64-bit string.
    return "dummy_hash_12345"; 
}

int main() {
    httplib::Server svr;

    // this is the main bouncer endpoint. the frontend sends the image here first.
    svr.Post("/api/analyze-cover", [](const httplib::Request& req, httplib::Response& res) {
        try {
            string image_hash = calculate_phash(req.body);
            pqxx::connection C(DB_CONN_STR);
            pqxx::nontransaction N(C);
            
            // querying our efficiency table to see if we've already processed this exact cover
            string query = "SELECT identified_comic_id FROM image_hashes WHERE phash = '" + image_hash + "'";
            pqxx::result R = N.exec(query);

            if (!R.empty()) {
                // cache hit! we completely bypass the python ml container and save gpu cycles.
                res.set_content("{\"status\": \"cached_hit\", \"comic_id\": " + R[0][0].as<string>() + "}", "application/json");
            } else {
                // cache miss. here we will forward the request to the python ml brain on port 8000.
                res.set_content("{\"status\": \"cache_miss\", \"action\": \"forwarding_to_pytorch\"}", "application/json");
            }
        } catch (const std::exception &e) {
            cerr << e.what() << endl;
            res.status = 500;
        }
    });

    cout << "C++ Bouncer listening on port 8081..." << endl;
    svr.listen("0.0.0.0", 8081);
    return 0;
}