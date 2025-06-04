import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Stack
} from '@mui/material';
import { Star } from '@mui/icons-material';

function CourseRating({ courseId }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [userRating, setUserRating] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserRating();
  }, [courseId]);

  const fetchUserRating = async () => {
    try {
      const response = await fetch(`/api/ratings/${courseId}/user`);
      const data = await response.json();
      if (data.rating) {
        setUserRating(data);
        setRating(data.rating);
        setReview(data.review);
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!rating) {
      setError('Please select a rating');
      return;
    }

    if (!review.trim()) {
      setError('Please write a review');
      return;
    }

    try {
      const method = userRating ? 'PUT' : 'POST';
      const url = userRating 
        ? `/api/ratings/${userRating.id}`
        : '/api/ratings';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          rating,
          review
        }),
      });

      if (!response.ok) throw new Error('Failed to submit rating');

      setSuccess(userRating ? 'Review updated successfully' : 'Review submitted successfully');
      setUserRating({ rating, review });
    } catch (error) {
      setError('Error submitting review. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {userRating ? 'Update Your Review' : 'Rate This Course'}
        </Typography>

        <Stack spacing={2}>
          {(error || success) && (
            <Alert severity={error ? 'error' : 'success'}>
              {error || success}
            </Alert>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              precision={0.5}
              icon={<Star fontSize="inherit" />}
              data-testid="rating-stars"
            />
            <Typography variant="body2" color="text.secondary">
              {rating} out of 5
            </Typography>
          </Box>

          <TextField
            multiline
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review here..."
            fullWidth
            data-testid="review-input"
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            data-testid="submit-review"
          >
            {userRating ? 'Update Review' : 'Submit Review'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CourseRating;