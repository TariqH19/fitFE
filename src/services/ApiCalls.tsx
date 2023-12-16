import axios from "axios";
import { Exercises, Workouts, Splits, Sessions, Weights } from "../types";

export async function addExercise(
  formData: Exercises,
  session: string
): Promise<any> {
  try {
    const response = await axios.post(
      "https://gym-api-omega.vercel.app/api/exercises/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${session}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("Exercise added successfully:", response.data);
    return response.data; // You can return additional data if needed
  } catch (error) {
    // console.error("Error adding exercise:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}

export async function editExercise(
  id: string,
  formData: Exercises,
  session: string
): Promise<any> {
  try {
    const response = await axios.put(
      `https://gym-api-omega.vercel.app/api/exercises/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${session}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("Exercise Edited successfully:", response.data);
    return response.data; // You can return additional data if needed
  } catch (error) {
    // console.error("Error editing exercise:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}

export async function addWorkout(
  formData: Workouts,
  session: string
): Promise<any> {
  try {
    const response = await axios.post(
      "https://gym-api-omega.vercel.app/api/workouts/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${session}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("Workout added successfully:", response.data);
    return response.data; // You can return additional data if needed
  } catch (error) {
    // console.error("Error adding workout:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}

export async function editWorkout(
  id: string,
  formData: Workouts,
  session: string
): Promise<any> {
  try {
    const response = await axios.put(
      `https://gym-api-omega.vercel.app/api/workouts/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${session}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("Workout Edited successfully:", response.data);
    return response.data; // You can return additional data if needed
  } catch (error) {
    // console.error("Error editing workout:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}

export async function addSplits(
  formData: Splits,
  session: string
): Promise<any> {
  try {
    const response = await axios.post(
      "https://gym-api-omega.vercel.app/api/splits/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${session}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("Split added successfully:", response.data);
    return response.data; // You can return additional data if needed
  } catch (error) {
    // console.error("Error adding Split:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}

export async function editSplit(
  id: string,
  formData: Splits,
  session: string
): Promise<any> {
  try {
    const response = await axios.put(
      `https://gym-api-omega.vercel.app/api/splits/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${session}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("Split Edited successfully:", response.data);
    return response.data; // You can return additional data if needed
  } catch (error) {
    // console.error("Error editing split:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}

export async function addSession(
  formData: Sessions,
  session: string
): Promise<any> {
  try {
    const response = await axios.post(
      "https://gym-api-omega.vercel.app/api/workoutsexercises/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${session}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("Session added successfully:", response.data);
    return response.data; // You can return additional data if needed
  } catch (error) {
    // console.error("Error adding Session:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}

export async function editSession(
  id: string,
  formData: Sessions,
  session: string
): Promise<any> {
  try {
    const response = await axios.put(
      `https://gym-api-omega.vercel.app/api/workoutsexercises/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${session}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("Session Edited successfully:", response.data);
    return response.data; // You can return additional data if needed
  } catch (error) {
    // console.error("Error editing session:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}

export async function addWeight(
  formData: Weights,
  session: string
): Promise<any> {
  try {
    const response = await axios.post(
      "https://gym-api-omega.vercel.app/api/weights/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${session}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("Weight added successfully:", response.data);
    return response.data; // You can return additional data if needed
  } catch (error) {
    // console.error("Error adding Weight:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}

export async function editWeight(
  id: string,
  formData: Weights,
  session: string
): Promise<any> {
  try {
    const response = await axios.put(
      `https://gym-api-omega.vercel.app/api/weights/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${session}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("Weight Edited successfully:", response.data);
    return response.data; // You can return additional data if needed
  } catch (error) {
    // console.error("Error editing weight:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}
