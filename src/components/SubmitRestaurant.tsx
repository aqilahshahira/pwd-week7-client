import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import { toast } from 'react-toastify';
import { submissionAPI } from '../services/api';
import { FaCheckCircle } from 'react-icons/fa';
import type { CreateSubmissionInput, SubmissionFormValues } from '../types';

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 600px;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ErrorMessage = styled.span`
  color: #ff4757;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.02);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 3rem;
  
  svg {
    font-size: 4rem;
    color: #4caf50;
    margin-bottom: 1rem;
  }
  
  h3 {
    color: #4caf50;
    margin-bottom: 1rem;
  }
`;

function SubmitRestaurant() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<SubmissionFormValues>();

  const onSubmit = async (data: SubmissionFormValues) => {
    try {
      const recommendedMenuArray = typeof data.recommendedMenu === 'string'
        ? data.recommendedMenu
            .split(/[\n,]/)
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

      const payload: CreateSubmissionInput = {
        restaurantName: data.restaurantName?.trim(),
        category: data.category,
        location: data.location?.trim(),
        priceRange: data.priceRange?.trim() || undefined,
        recommendedMenu: recommendedMenuArray.length ? recommendedMenuArray : undefined,
        review: data.review?.trim() || undefined,
        submitterName: data.submitterName?.trim() || undefined,
        submitterEmail: data.submitterEmail?.trim() || undefined,
      };

      await submissionAPI.createSubmission(payload);
      setSubmitted(true);
      toast.success('The restaurant has been successfully reported! 🎉');
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      toast.error('제출 중 오류가 발생했습니다.');
    }
  };

  if (submitted) {
    return (
      <FormContainer>
        <SuccessMessage>
          <FaCheckCircle />
          <h3>Thank you for the tip!</h3>
          <p>Campus Food Map gets richer thanks to your tips.</p>
          <button onClick={() => setSubmitted(false)}>
            Report another restaurant
          </button>
        </SuccessMessage>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <FormTitle>🍽️ Submit a new restaurant tip</FormTitle>
      <p>Practice reports are saved only in this browser and are not shared with other users.</p>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <FormGroup>
          <Label htmlFor="restaurantName">Restaurant name *</Label>
          <Input
            id="restaurantName"
            {...register("restaurantName", {
              required: "The restaurant name is required"
            })}
            placeholder="Example: OO Restaurant"
          />
          {errors.restaurantName && (
            <ErrorMessage>{errors.restaurantName.message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="category">Category *</Label>
          <Select
            id="category"
            {...register("category", {
              required: "Please select the category"
            })}
          >
            <option value="">Choose</option>
            <option value="Korean cuisine">Korean cuisine</option>
            <option value="Chinese cuisine">Chinese cuisine</option>
            <option value="Japanese cuisine">Japanese cuisine</option>
            <option value="Western">Western</option>
            <option value="Asian">Asian</option>
            <option value="Snack">Snack</option>
            <option value="Cafe">Cafe</option>
            <option value="Other">Other</option>
          </Select>
          {errors.category && (
            <ErrorMessage>{errors.category.message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            {...register("location", {
              required: "Location is essential"
            })}
            placeholder="Example: 5-minute walk to the main gate of Ajou University"
          />
          {errors.location && (
            <ErrorMessage>{errors.location.message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="priceRange">Price range</Label>
          <Input
            id="priceRange"
            {...register("priceRange")}
            placeholder="Example: 8,000–12,000 KRW"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="recommendedMenu">Recommended menu</Label>
          <Textarea
            id="recommendedMenu"
            {...register("recommendedMenu")}
            placeholder="Examples: spicy stir-fried chicken and cheese, buckwheat noodles, fried rice"
          />
        </FormGroup>


        <FormGroup>
          <Label htmlFor="review">One-line review</Label>
          <Textarea
            id="review"
            {...register("review")}
            placeholder="Please tell us what makes this restaurant special"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="submitterName">Informant's name</Label>
          <Input
            id="submitterName"
            {...register("submitterName")}
            placeholder="Option"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="submitterEmail">Email</Label>
          <Input
            id="submitterEmail"
            type="email"
            {...register("submitterEmail", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "This is not a valid email format."
              }
            })}
            placeholder="Optional (email address for response)"
          />
          {errors.submitterEmail && (
            <ErrorMessage>{errors.submitterEmail.message}</ErrorMessage>
          )}
        </FormGroup>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Report a great restaurant'}
        </SubmitButton>
      </form>
    </FormContainer>
  );
}

export default SubmitRestaurant;