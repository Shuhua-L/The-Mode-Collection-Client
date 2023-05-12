import React, { useState, useEffect } from 'react'
import axios from 'axios';

import ProductBreakdown from './ProductBreakdown.jsx';
import RatingBreakdown from './RatingBreakdown.jsx';
import SortOption from './SortOption.jsx';
import ReviewList from './ReviewList.jsx';

import { getTotalNumOfReviews } from './helper.js';
import { exampleReviews, exampleMeta, emptyMeta } from './exampleData';

const Reviews = ({ currentItemID, avgRating, reviewsMeta }) => {

    const [reviews, setReviews] = useState([]);
    const [meta, setMeta] = useState(reviewsMeta);
    const [numOfReviews, setNumOfReviews] = useState(0);
    const [sort, setSort] = useState("relevant");
    const [filters, setFilters] = useState([]);
    const [currentDisplay, setCurrentDisplay] = useState([]);

    // console.log('Reviews metadata inside module: ', reviewsMeta)

    const updateReviewsByFilter = (reviews) => {
        if (filters.length === 0) {
            setReviews(reviews);
        } else {
             // filter ratings by rating
             let result = [];
             filters.forEach(rating => {
                 let reviewsByRating = reviews.filter(review =>
                     review.rating === rating
                 );
                 result = result.concat(reviewsByRating);
             })
            //  console.log("Result ", result);
             setReviews(result);
        }
    }

    useEffect(() => {
        setMeta(reviewsMeta);
        setNumOfReviews(getTotalNumOfReviews(reviewsMeta));
    }, [reviewsMeta])

    useEffect(() => {
        if (currentItemID && (numOfReviews > 0)) {
            let url = `/reviews/?product_id=${currentItemID}&sort=${sort}&count=${numOfReviews}`;
            axios.get(url)
                .then(response => {
                    // console.log('Reviews sorted by', sort, ': ', response.data);
                    updateReviewsByFilter(response.data.results);
                })
                .catch(error =>
                    console.log('Error getting reviews inside module 🤕', error))
        }
    }, [currentItemID, numOfReviews, sort])

    useEffect(() => {
        console.log("filters: ", filters);
        if (filters.length === 0) {
            setCurrentDisplay(reviews);
        } else {
            // filter ratings by rating
            let result = [];
            filters.forEach(rating => {
                let reviewsByRating = reviews.filter(review =>
                    review.rating === rating
                );
                result = result.concat(reviewsByRating);
            })
            console.log("Result ", result);
            setCurrentDisplay(result);
        }
    }, [filters])

    useEffect(() => {
        // update currentDisplay
        // let currentLength = currentDisplay.length;
        // if (reviews.length > currentLength) {
        //   setCurrentDisplay(reviews.slice(0, currentLength + 2));
        // }
        // console.log("Reviews inside list: ", reviews);
        if (currentDisplay.length === 0) {
            setCurrentDisplay(reviews.slice(0, 2));
        } else {
            setCurrentDisplay(reviews.slice(0, currentDisplay.length));
        }

    }, [reviews])

    const removeReview = (reviewID) => {
        let filteredReviews = reviews.filter(review =>
            review.review_id !== reviewID)
            updateReviewsByFilter(filteredReviews);
    }

    // const filterReviewByRating = (rating) => {
    //     let filteredReviews = reviews.filter(review => {

    //         return review.rating === rating
    //     })
    //     console.log(filteredReviews)
    //     // setReviews(filteredReviews);
    // }

    // const updateFilters = (rating) => {
    //     if (filters.indexOf(rating) === -1) {
    //         setFilters([...filters, rating])
    //         // setFilters(filters.push(rating))
    //     } else {
    //         setFilters(filters.filter(x => x != rating));
    //     }

    // }

    const displayTwoMoreReviews = () => {
        let currentLength = currentDisplay.length;
        if (reviews.length > currentLength) {
            setCurrentDisplay(reviews.slice(0, currentLength + 2));
        }
    }

    return (
        <div className="widget" id="review-module">

            <h3>RATINGS & REVIEWS </h3>

            <div className="col-25">
                <RatingBreakdown filters={filters}
                    reviewsMeta={meta} setFilters={setFilters} />

                <ProductBreakdown
                    characteristics={meta.characteristics} />

            </div>


            <div className="col-75">
                <SortOption
                    reviews={reviews} sort={sort} setSort={setSort} />
                <ReviewList
                    reviews={reviews} removeReview={removeReview}
                    currentDisplay={currentDisplay}
                    displayTwoMoreReviews={displayTwoMoreReviews} />
            </div>

        </div>
    )
}

export default Reviews;