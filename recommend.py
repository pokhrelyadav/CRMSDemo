from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from bson import ObjectId

app = Flask(__name__)

# Enable CORS for the Flask app
CORS(app)  # This allows all origins by default

# MongoDB connection
client = MongoClient("mongodb+srv://mongodbyadav123:mongodbyadav123@pokhrelcluster.sooa4rs.mongodb.net/CustomerRetailerManagement?retryWrites=true&w=majority&appName=pokhrelcluster")
db = client["CustomerRetailerManagement"]
products_collection = db["foods"]  # Collection for food products

# Function to fetch all products from MongoDB and serialize ObjectId
def fetch_all_products():
    products = list(products_collection.find({}, {"_id": 1, "name": 1, "description": 1, "foodType": 1, "price": 1, "image": 1, "quantity": 1}))
    # Convert ObjectId to string for each product
    for product in products:
        product["_id"] = str(product["_id"])
    return products

# Function to compute TF-IDF and cosine similarity
def get_recommendations(product_id, top_n=5):
    # Fetch all products
    products = fetch_all_products()
    print(products)  # For debugging

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
    return recommended_products[:2]

# API endpoint to get recommendations
@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    product_id = data.get("product_id")  # Product ID added to the cart
    print(f"Received product_id: {product_id}")  # For debugging

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    recommendations = get_recommendations(product_id)
    if not recommendations:
        return jsonify({"error": "No recommendations found for this product ID"}), 404

    return jsonify({"recommendations": recommendations})

if __name__ == "__main__":
    app.run(debug=True)