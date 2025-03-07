from flask import Flask, request, jsonify
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = Flask(__name__)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["your_database_name"]
products_collection = db["foods"]  # Assuming your collection is named "foods"

# Function to fetch all products from MongoDB
def fetch_all_products():
    products = list(products_collection.find({}, {"_id": 1, "name": 1, "description": 1, "foodType": 1}))
    return products

# Function to compute TF-IDF and cosine similarity
def get_recommendations(product_id, top_n=5):
    # Fetch all products
    products = fetch_all_products()
    
    # Extract product details
    product_descriptions = [product["description"] for product in products]
    product_ids = [str(product["_id"]) for product in products]  # Use MongoDB _id as product ID
    
    # Find the index of the product added to the cart
    target_index = next((i for i, product in enumerate(products) if str(product["_id"]) == product_id), None)
    
    if target_index is None:
        return []
    
    # Compute TF-IDF matrix
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(product_descriptions)
    
    # Compute cosine similarity
    cosine_sim = cosine_similarity(tfidf_matrix[target_index], tfidf_matrix).flatten()
    
    # Get top N similar products (excluding itself)
    similar_indices = cosine_sim.argsort()[-top_n-1:-1][::-1]
    
    # Return recommended products
    recommended_products = [products[i] for i in similar_indices]
    return recommended_products

# API endpoint to get recommendations
@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    product_id = data.get("product_id")  # Product ID added to the cart
    
    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400
    
    recommendations = get_recommendations(product_id)
    return jsonify({"recommendations": recommendations})

if __name__ == "__main__":
    app.run(debug=True) 