
import { TrainClass } from './types';

export const STATIONS = [
    { name: "New Delhi", code: "NDLS" },
    { name: "Mumbai Central", code: "MMCT" },
    { name: "Howrah Junction", code: "HWH" },
    { name: "Chennai Central", code: "MAS" },
    { name: "Bengaluru City", code: "SBC" },
    { name: "Pune Junction", code: "PUNE" },
    { name: "Hyderabad Deccan", code: "HYB" },
    { name: "Ahmedabad Junction", code: "ADI" },
    { name: "Jaipur Junction", code: "JP" },
    { name: "Lucknow Charbagh", code: "LKO" },
];

export const TRAIN_CLASSES: TrainClass[] = [
    TrainClass.SLEEPER,
    TrainClass.AC3,
    TrainClass.AC2,
    TrainClass.AC1,
    TrainClass.GENERAL,
];
