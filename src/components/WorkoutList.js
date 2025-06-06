import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { WorkoutCard } from './WorkoutCard';
export const WorkoutList = ({ workouts }) => (_jsx("div", { className: "workout-list", children: workouts.map((w) => (_jsx(WorkoutCard, { workout: w }, w.id))) }));
