"use client";

import { useState, useEffect } from "react";
import { Star, Edit, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Swal from "sweetalert2";
import {
  getMyReviewsAction,
  updateReviewAction,
  deleteReviewAction,
  type Review,
} from "@/src/app/(CommonLayout)/action/review";

const MyReviewsTable = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editFormData, setEditFormData] = useState({ rating: 5, reviewText: "" });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const reviewsData = await getMyReviewsAction();
      setReviews(reviewsData);
    } catch (err) {
      setMessage({ ok: false, text: "Failed to load reviews." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingReview) return;

    try {
      const result = await updateReviewAction(
        editingReview.id,
        editFormData.rating,
        editFormData.reviewText
      );
      setMessage({ ok: result.success, text: result.message });
      if (result.success) {
        setEditingReview(null);
        await loadReviews();
      }
    } catch (err) {
      setMessage({ ok: false, text: "Failed to update review." });
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleDelete = async (reviewId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const deleteResult = await deleteReviewAction(reviewId);
      setMessage({ ok: deleteResult.success, text: deleteResult.message });
      if (deleteResult.success) {
        await loadReviews();
        await Swal.fire({
          title: "Deleted!",
          text: "Your review has been deleted.",
          icon: "success",
        });
      }
    } catch (err) {
      setMessage({ ok: false, text: "Failed to delete review." });
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const startEditing = (review: Review) => {
    setEditingReview(review);
    setEditFormData({
      rating: review.rating,
      reviewText: review.reviewText || "",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${
          star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`rounded-md border px-3 py-2 text-sm ${
            message.ok
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          No reviews yet. Start reviewing events you've attended!
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Review</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {review.event?.image && (
                        <img
                          src={review.event.image}
                          alt={review.event.title}
                          width={48}
                          height={48}
                          className="rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{review.event?.title || "Unknown Event"}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(review.event?.date || review.createdAt)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-muted-foreground">({review.rating}/5)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {editingReview?.id === review.id ? (
                      <textarea
                        value={editFormData.reviewText}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, reviewText: e.target.value })
                        }
                        className="w-full p-2 border rounded resize-none"
                        rows={2}
                      />
                    ) : (
                      <p className="line-clamp-2 max-w-xs">{review.reviewText || "No comment"}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">{formatDate(review.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {editingReview?.id === review.id ? (
                        <>
                          <Button
                            onClick={handleUpdate}
                            size="sm"
                            disabled={!editFormData.reviewText.trim()}
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => setEditingReview(null)}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => startEditing(review)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(review.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyReviewsTable;
