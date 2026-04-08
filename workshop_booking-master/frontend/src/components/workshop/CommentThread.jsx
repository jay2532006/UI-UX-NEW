import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * CommentThread component - displays and manages comments
 * @param {Array} comments - array of comment objects
 * @param {boolean} canComment - whether user can add comments
 * @param {function} onAddComment - callback to add a comment
 */
export default function CommentThread({ comments = [], canComment = false, onAddComment = null }) {
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !onAddComment) return;

    setSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Comments ({comments.length})</h3>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-6 text-gray-500">No comments yet</div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Card key={comment.id} className="bg-gray-50">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    {comment.author?.first_name} {comment.author?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-2">{comment.text}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      {canComment && onAddComment && (
        <form onSubmit={handleSubmit} className="space-y-3 mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-fossee-blue focus:outline-none min-h-[100px]"
            disabled={submitting}
          />
          <Button
            type="submit"
            fullWidth
            variant="primary"
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      )}
    </div>
  );
}
