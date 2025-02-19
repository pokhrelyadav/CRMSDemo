from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from pymongo import MongoClient

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:8000/")
db = client["CustomerRetailerManagement"]
food_collection = db["foods"]
recommend_collection = db["recommend"]

# Load Food Data from CSV
def load_data_from_mongo():
    # Get food data from MongoDB (only 'name' and 'description' fields)
    food_data = food_collection.find({}, {"_id": 0, "name": 1, "description": 1})
    df = pd.DataFrame(list(food_data))
    df["combined_text"] = df["name"] + " " + df["description"]
    return df


# Compute TF-IDF Similarity and Store Recommendations
def compute_and_store_recommendations():
    df = load_data_from_mongo()
    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform(df["combined_text"])
    similarity_matrix = cosine_similarity(tfidf_matrix)

    recommendations = {}

    for idx, row in df.iterrows():
        similar_indices = similarity_matrix[idx].argsort()[-6:-1][::-1]  # Top 5 excluding itself
        recommended_items = df.iloc[similar_indices]["name"].tolist()

        recommendations[row["name"]] = recommended_items

        # Store recommendations in MongoDB
        recommend_collection.update_one(
            {"food": row["name"]}, {"$set": {"recommended": recommended_items}}, upsert=True
        )

    print("Recommendations updated in MongoDB.")


# API to Get Recommendations for a Food Item
@app.route("/recommend", methods=["GET"])
def get_recommendations():
    food_item = request.args.get("food")
    if not food_item:
        return jsonify({"error": "Food item not provided"}), 400

    result = recommend_collection.find_one({"food": food_item}, {"_id": 0, "recommended": 1})

    if result:
        return jsonify({"food": food_item, "recommended": result["recommended"]})
    else:
        return jsonify({"food": food_item, "recommended": []})


# Run computations on startup
compute_and_store_recommendations()

if __name__ == "__main__":
    app.run(port=8000, debug=True)
