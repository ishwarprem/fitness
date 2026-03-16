/**
 * Personalized Workout Generator
 * Generates workout plans tailored to user's goals, equipment, experience, and limitations
 */

// ==========================================
// EXERCISE DATABASE WITH METADATA
// Categorized by goal suitability, equipment requirements, and injury considerations
// ==========================================

const EXERCISE_DATABASE = {
    // CHEST EXERCISES
    "Chest": {
        // High cardiovascular / Fat Loss Focused
        "fatLoss": [
            { name: "Push Ups", videoUrl: "https://media.giphy.com/media/Nx0rz3jtxtEre/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "dumbbells_only", "full_gym"], injuries: ["wrist"] },
            { name: "Incline Push Ups", videoUrl: "https://media.giphy.com/media/4FG5Nl1xHxMRy/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "dumbbells_only", "full_gym"], injuries: [] },
            { name: "Chest Dips", videoUrl: "https://media.giphy.com/media/l0ErMq4SxbNJLtjfq/giphy.gif", type: "image", equipment: ["basic_equipment", "full_gym"], injuries: ["shoulder", "wrist", "elbow"] },
            { name: "Cable Chest Fly", videoUrl: "https://i.makeagif.com/media/9-28-2015/-z-AFG.gif", type: "image", equipment: ["cables_only", "full_gym"], injuries: ["shoulder"] },
            { name: "Fast-Tempo Dumbbell Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2013.mp4", type: "video", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: ["shoulder", "elbow"] }
        ],
        // Muscle Building Focused (controlled, heavy, machine-based)
        "buildMuscle": [
            { name: "Flat Barbell Bench Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2001.mp4", type: "video", equipment: ["full_gym"], injuries: ["shoulder", "wrist", "elbow"] },
            { name: "Incline Dumbbell Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2013.mp4", type: "video", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: ["shoulder"] },
            { name: "Smith Machine Flat Bench Press", videoUrl: "https://gymvisual.com/img/p/1/5/2/5/2/15252.gif", type: "image", equipment: ["full_gym"], injuries: ["shoulder"] },
            { name: "Machine Chest Press", videoUrl: "https://gymvisual.com/img/p/2/0/7/0/2/20702.gif", type: "image", equipment: ["full_gym"], injuries: [] },
            { name: "Decline Barbell Bench Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2007.mp4", type: "video", equipment: ["full_gym"], injuries: ["shoulder", "elbow"] },
            { name: "Cable Chest Fly", videoUrl: "https://i.makeagif.com/media/9-28-2015/-z-AFG.gif", type: "image", equipment: ["cables_only", "full_gym"], injuries: ["shoulder"] }
        ],
        // General/Recomp - Balanced approach
        "general": [
            { name: "Flat Dumbbell Bench Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2002.mp4", type: "video", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: ["shoulder"] },
            { name: "Push Ups", videoUrl: "https://media.giphy.com/media/Nx0rz3jtxtEre/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "dumbbells_only", "full_gym"], injuries: ["wrist"] },
            { name: "Incline Dumbbell Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2013.mp4", type: "video", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: ["shoulder"] },
            { name: "Cable Chest Fly", videoUrl: "https://i.makeagif.com/media/9-28-2015/-z-AFG.gif", type: "image", equipment: ["cables_only", "full_gym"], injuries: ["shoulder"] }
        ]
    },

    // BACK EXERCISES
    "Back": {
        "fatLoss": [
            { name: "Pull-Ups (Wide Grip)", videoUrl: "https://media.tenor.com/bOA5VPeUz5QAAAAM/noequipmentexercisesmen-pullups.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["shoulder", "elbow"] },
            { name: "Australian Rows (Inverted Rows)", videoUrl: "https://gymvisual.com/img/p/2/5/4/7/2/25472.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: [] },
            { name: "Band Pull-Aparts", videoUrl: "https://gymvisual.com/img/p/2/8/4/8/2/28482.gif", type: "image", equipment: ["basic_equipment", "full_gym"], injuries: [] },
            { name: "Rowing Machine", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/5008.mp4", type: "video", equipment: ["full_gym"], injuries: ["back"] }
        ],
        "buildMuscle": [
            { name: "Barbell Rows", videoUrl: "https://downloads.ctfassets.net/6ilvqec50fal/26TEIC8oITW2g58iY4lx9i/bc3ddf88afd1fa401738c39e64a17dfa/Reverse_Grip_-_Underhand_-_Barbell_Bent-Over_Row.gif", type: "image", equipment: ["full_gym"], injuries: ["back", "wrist"] },
            { name: "Lat Pulldown", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/1011.mp4", type: "video", equipment: ["cables_only", "full_gym"], injuries: ["shoulder"] },
            { name: "Seated Cable Rows", videoUrl: "https://gymvisual.com/img/p/1/5/2/4/1/15241.gif", type: "image", equipment: ["cables_only", "full_gym"], injuries: [] },
            { name: "T-Bar Rows", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/1006.mp4", type: "video", equipment: ["full_gym"], injuries: ["back"] },
            { name: "Deadlifts", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/1001.mp4", type: "video", equipment: ["full_gym"], injuries: ["back", "knee"] }
        ],
        "general": [
            { name: "Pull-Ups (Wide Grip)", videoUrl: "https://media.tenor.com/bOA5VPeUz5QAAAAM/noequipmentexercisesmen-pullups.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["shoulder", "elbow"] },
            { name: "Seated Cable Rows", videoUrl: "https://gymvisual.com/img/p/1/5/2/4/1/15241.gif", type: "image", equipment: ["cables_only", "full_gym"], injuries: [] },
            { name: "Face Pulls", videoUrl: "https://burnfit.io/wp-content/uploads/2023/11/FACE_PULL.gif", type: "image", equipment: ["cables_only", "full_gym"], injuries: [] },
            { name: "Dumbbell Rows", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/1003.mp4", type: "video", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: [] }
        ]
    },

    // SHOULDERS EXERCISES
    "Shoulders": {
        "fatLoss": [
            { name: "Dumbbell Shoulder Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/3001.mp4", type: "video", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: ["shoulder"] },
            { name: "Lateral Raises", videoUrl: "https://burnfit.io/wp-content/uploads/2023/11/DB_LAT_RAISE.gif", type: "image", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: ["shoulder"] },
            { name: "Pike Push Ups", videoUrl: "https://media.giphy.com/media/l0MYB8Jtm2BFGLEI0/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["shoulder", "wrist"] },
            { name: "Band Face Pulls", videoUrl: "https://gymvisual.com/img/p/2/8/4/8/3/28483.gif", type: "image", equipment: ["basic_equipment", "full_gym"], injuries: [] }
        ],
        "buildMuscle": [
            { name: "Overhead Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/3002.mp4", type: "video", equipment: ["full_gym"], injuries: ["shoulder", "back"] },
            { name: "Smith Machine Shoulder Press", videoUrl: "https://gymvisual.com/img/p/1/5/2/5/5/15255.gif", type: "image", equipment: ["full_gym"], injuries: ["shoulder"] },
            { name: "Lateral Raises", videoUrl: "https://burnfit.io/wp-content/uploads/2023/11/DB_LAT_RAISE.gif", type: "image", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: ["shoulder"] },
            { name: "Rear Delt Machine", videoUrl: "https://gymvisual.com/img/p/2/0/9/0/1/20901.gif", type: "image", equipment: ["full_gym"], injuries: [] },
            { name: "Cable Lateral Raises", videoUrl: "https://gymvisual.com/img/p/1/5/3/2/1/15321.gif", type: "image", equipment: ["cables_only", "full_gym"], injuries: ["shoulder"] }
        ],
        "general": [
            { name: "Dumbbell Shoulder Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/3001.mp4", type: "video", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: ["shoulder"] },
            { name: "Lateral Raises", videoUrl: "https://burnfit.io/wp-content/uploads/2023/11/DB_LAT_RAISE.gif", type: "image", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: ["shoulder"] },
            { name: "Face Pulls", videoUrl: "https://burnfit.io/wp-content/uploads/2023/11/FACE_PULL.gif", type: "image", equipment: ["cables_only", "full_gym"], injuries: [] }
        ]
    },

    // TRICEPS EXERCISES
    "Triceps": {
        "fatLoss": [
            { name: "Diamond Push Ups", videoUrl: "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["wrist", "elbow"] },
            { name: "Bench Dips", videoUrl: "https://gymvisual.com/img/p/2/5/4/7/1/25471.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["shoulder", "elbow"] },
            { name: "Cable Pushdowns", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/6002.mp4", type: "video", equipment: ["cables_only", "full_gym"], injuries: [] },
            { name: "Kickbacks", videoUrl: "https://gymvisual.com/img/p/1/8/8/0/1/18801.gif", type: "image", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: ["elbow"] }
        ],
        "buildMuscle": [
            { name: "Cable Pushdowns", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/6002.mp4", type: "video", equipment: ["cables_only", "full_gym"], injuries: [] },
            { name: "Overhead Tricep Extensions", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/6032.mp4", type: "video", equipment: ["dumbbells_only", "cables_only", "basic_equipment", "full_gym"], injuries: ["shoulder", "elbow"] },
            { name: "Skull Crushers", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/6003.mp4", type: "video", equipment: ["full_gym"], injuries: ["elbow", "wrist"] },
            { name: "Close-Grip Bench Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/2004.mp4", type: "video", equipment: ["full_gym"], injuries: ["shoulder", "wrist"] },
            { name: "Tricep Dips", videoUrl: "https://media.giphy.com/media/l0ErMq4SxbNJLtjfq/giphy.gif", type: "image", equipment: ["basic_equipment", "full_gym"], injuries: ["shoulder", "elbow"] }
        ],
        "general": [
            { name: "Cable Pushdowns", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/6002.mp4", type: "video", equipment: ["cables_only", "full_gym"], injuries: [] },
            { name: "Overhead Tricep Extensions", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/6032.mp4", type: "video", equipment: ["dumbbells_only", "cables_only", "basic_equipment", "full_gym"], injuries: ["shoulder", "elbow"] },
            { name: "Diamond Push Ups", videoUrl: "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["wrist", "elbow"] }
        ]
    },

    // BICEPS EXERCISES
    "Biceps": {
        "fatLoss": [
            { name: "Hammer Curls", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/7009.mp4", type: "video", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: ["elbow", "wrist"] },
            { name: "Resistance Band Curls", videoUrl: "https://gymvisual.com/img/p/2/8/4/8/1/28481.gif", type: "image", equipment: ["basic_equipment", "full_gym"], injuries: [] },
            { name: "Chin-Ups", videoUrl: "https://media.giphy.com/media/l0MYB8Jtm2BFGLEI0/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["shoulder", "elbow"] }
        ],
        "buildMuscle": [
            { name: "Barbell Curls", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/7001.mp4", type: "video", equipment: ["full_gym"], injuries: ["wrist", "elbow"] },
            { name: "Incline Dumbbell Curls", videoUrl: "https://www.strengthlog.com/wp-content/uploads/2020/10/Incline-Dumbbell-Curl.gif", type: "image", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: ["shoulder"] },
            { name: "Preacher Curls", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/7004.mp4", type: "video", equipment: ["full_gym"], injuries: ["elbow"] },
            { name: "Cable Curls", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/7010.mp4", type: "video", equipment: ["cables_only", "full_gym"], injuries: [] },
            { name: "Hammer Curls", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/7009.mp4", type: "video", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: ["elbow", "wrist"] }
        ],
        "general": [
            { name: "Hammer Curls", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/7009.mp4", type: "video", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: ["elbow", "wrist"] },
            { name: "Incline Dumbbell Curls", videoUrl: "https://www.strengthlog.com/wp-content/uploads/2020/10/Incline-Dumbbell-Curl.gif", type: "image", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: ["shoulder"] },
            { name: "Cable Curls", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/7010.mp4", type: "video", equipment: ["cables_only", "full_gym"], injuries: [] }
        ]
    },

    // LEGS EXERCISES
    "Legs": {
        "fatLoss": [
            { name: "Bodyweight Squats", videoUrl: "https://media.giphy.com/media/1qfKN8Dt0CRdCRxz9q/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "dumbbells_only", "full_gym"], injuries: ["knee", "back"] },
            { name: "Jump Squats", videoUrl: "https://media.giphy.com/media/23hPPMRgPxbNBlPQe3/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["knee", "ankle"] },
            { name: "Lunges", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4021.mp4", type: "video", equipment: ["bodyweight_only", "dumbbells_only", "basic_equipment", "full_gym"], injuries: ["knee"] },
            { name: "Step-Ups", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4022.mp4", type: "video", equipment: ["bodyweight_only", "dumbbells_only", "basic_equipment", "full_gym"], injuries: ["knee"] },
            { name: "Glute Bridges", videoUrl: "https://gymvisual.com/img/p/2/5/4/7/3/25473.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: [] }
        ],
        "buildMuscle": [
            { name: "Barbell Squats", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4001.mp4", type: "video", equipment: ["full_gym"], injuries: ["knee", "back"] },
            { name: "Leg Press", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4067.mp4", type: "video", equipment: ["full_gym"], injuries: ["knee"] },
            { name: "Romanian Deadlifts", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/1004.mp4", type: "video", equipment: ["full_gym", "dumbbells_only"], injuries: ["back"] },
            { name: "Leg Curls", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4004.mp4", type: "video", equipment: ["full_gym"], injuries: [] },
            { name: "Leg Extensions", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4007.mp4", type: "video", equipment: ["full_gym"], injuries: ["knee"] },
            { name: "Hip Thrusts", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4031.mp4", type: "video", equipment: ["full_gym", "basic_equipment"], injuries: [] },
            { name: "Standing Calf Raises", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4053.mp4", type: "video", equipment: ["full_gym"], injuries: ["ankle"] }
        ],
        "general": [
            { name: "Goblet Squats", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4002.mp4", type: "video", equipment: ["dumbbells_only", "basic_equipment", "full_gym"], injuries: ["knee", "back"] },
            { name: "Romanian Deadlifts", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/1004.mp4", type: "video", equipment: ["full_gym", "dumbbells_only"], injuries: ["back"] },
            { name: "Lunges", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4021.mp4", type: "video", equipment: ["bodyweight_only", "dumbbells_only", "basic_equipment", "full_gym"], injuries: ["knee"] },
            { name: "Glute Bridges", videoUrl: "https://gymvisual.com/img/p/2/5/4/7/3/25473.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: [] },
            { name: "Calf Raises", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/4053.mp4", type: "video", equipment: ["bodyweight_only", "dumbbells_only", "basic_equipment", "full_gym"], injuries: ["ankle"] }
        ]
    },

    // CORE EXERCISES
    "Core": {
        "fatLoss": [
            { name: "Mountain Climbers", videoUrl: "https://media.giphy.com/media/l0MYN7wNwqAhzAatW/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["wrist"] },
            { name: "Burpees", videoUrl: "https://media.giphy.com/media/23hPPMRgPxbNBlPQe3/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["knee", "wrist"] },
            { name: "Bicycle Crunches", videoUrl: "https://gymvisual.com/img/p/2/5/4/7/4/25474.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["back"] },
            { name: "Russian Twists", videoUrl: "https://gymvisual.com/img/p/2/5/4/7/5/25475.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["back"] },
            { name: "High Knees", videoUrl: "https://media.giphy.com/media/l0MYB6DnI0kHpA3te/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["knee", "ankle"] }
        ],
        "buildMuscle": [
            { name: "Cable Crunches", videoUrl: "https://gymvisual.com/img/p/1/5/3/2/2/15322.gif", type: "image", equipment: ["cables_only", "full_gym"], injuries: [] },
            { name: "Hanging Leg Raises", videoUrl: "https://gymvisual.com/img/p/2/5/4/7/6/25476.gif", type: "image", equipment: ["basic_equipment", "full_gym"], injuries: ["back"] },
            { name: "Weighted Planks", videoUrl: "https://gymvisual.com/img/p/2/5/4/7/7/25477.gif", type: "image", equipment: ["basic_equipment", "full_gym"], injuries: ["back", "wrist"] },
            { name: "Ab Wheel Rollouts", videoUrl: "https://gymvisual.com/img/p/2/5/4/7/8/25478.gif", type: "image", equipment: ["basic_equipment", "full_gym"], injuries: ["back", "wrist"] },
            { name: "Decline Sit-Ups", videoUrl: "https://gymvisual.com/img/p/2/5/4/7/9/25479.gif", type: "image", equipment: ["full_gym"], injuries: ["back"] }
        ],
        "general": [
            { name: "Plank", videoUrl: "https://gymvisual.com/img/p/2/5/4/8/0/25480.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["wrist"] },
            { name: "Dead Bug", videoUrl: "https://gymvisual.com/img/p/2/5/4/8/1/25481.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: [] },
            { name: "Crunches", videoUrl: "https://gymvisual.com/img/p/2/5/4/8/2/25482.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["back"] },
            { name: "Lying Leg Raises", videoUrl: "https://gymvisual.com/img/p/2/5/4/8/3/25483.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["back"] }
        ]
    },

    // CARDIO EXERCISES
    "Cardio": {
        "fatLoss": [
            { name: "Treadmill Running", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/5001.mp4", type: "video", equipment: ["full_gym"], injuries: ["knee", "ankle"] },
            { name: "Jump Rope", videoUrl: "https://media.giphy.com/media/3o7TKGYknBNsadHzSU/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["knee", "ankle"] },
            { name: "Burpees", videoUrl: "https://media.giphy.com/media/23hPPMRgPxbNBlPQe3/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["knee", "wrist"] },
            { name: "Rowing Machine", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/5008.mp4", type: "video", equipment: ["full_gym"], injuries: ["back"] },
            { name: "Battle Rope", videoUrl: "https://media.giphy.com/media/l0HlFZ3c4NENSLQRi/giphy.gif", type: "image", equipment: ["full_gym"], injuries: ["shoulder"] },
            { name: "Mountain Climbers", videoUrl: "https://media.giphy.com/media/l0MYN7wNwqAhzAatW/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["wrist"] }
        ],
        "buildMuscle": [
            { name: "Incline Treadmill Walk", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/5002.mp4", type: "video", equipment: ["full_gym"], injuries: [] },
            { name: "Elliptical Machine", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/5003.mp4", type: "video", equipment: ["full_gym"], injuries: [] },
            { name: "Brisk Walking", videoUrl: "https://media.giphy.com/media/l0MYyV0KPwlRj1z1e/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: [] }
        ],
        "general": [
            { name: "Treadmill Running", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/5001.mp4", type: "video", equipment: ["full_gym"], injuries: ["knee", "ankle"] },
            { name: "Elliptical Machine", videoUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/5003.mp4", type: "video", equipment: ["full_gym"], injuries: [] },
            { name: "Jump Rope", videoUrl: "https://media.giphy.com/media/3o7TKGYknBNsadHzSU/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: ["knee", "ankle"] },
            { name: "Brisk Walking", videoUrl: "https://media.giphy.com/media/l0MYyV0KPwlRj1z1e/giphy.gif", type: "image", equipment: ["bodyweight_only", "basic_equipment", "full_gym"], injuries: [] }
        ]
    }
};

// ==========================================
// WORKOUT SPLIT TEMPLATES
// Based on training frequency
// ==========================================

const SPLIT_TEMPLATES = {
    2: { // Full Body x2
        name: "Full Body",
        schedule: {
            "Monday": { type: "Full Body A", muscles: ["Chest", "Back", "Shoulders", "Legs", "Core"] },
            "Tuesday": { type: "Rest", muscles: [] },
            "Wednesday": { type: "Rest", muscles: [] },
            "Thursday": { type: "Full Body B", muscles: ["Chest", "Back", "Legs", "Biceps", "Triceps", "Core"] },
            "Friday": { type: "Rest", muscles: [] },
            "Saturday": { type: "Rest", muscles: [] },
            "Sunday": { type: "Rest", muscles: [] }
        }
    },
    3: { // Full Body or PPL
        name: "Full Body",
        schedule: {
            "Monday": { type: "Full Body A", muscles: ["Chest", "Back", "Legs", "Shoulders", "Core"] },
            "Tuesday": { type: "Rest", muscles: [] },
            "Wednesday": { type: "Full Body B", muscles: ["Chest", "Back", "Legs", "Biceps", "Triceps"] },
            "Thursday": { type: "Rest", muscles: [] },
            "Friday": { type: "Full Body C", muscles: ["Shoulders", "Back", "Legs", "Core", "Cardio"] },
            "Saturday": { type: "Rest", muscles: [] },
            "Sunday": { type: "Rest", muscles: [] }
        }
    },
    4: { // Upper/Lower
        name: "Upper/Lower",
        schedule: {
            "Monday": { type: "Upper A", muscles: ["Chest", "Back", "Shoulders", "Biceps", "Triceps"] },
            "Tuesday": { type: "Lower A", muscles: ["Legs", "Core"] },
            "Wednesday": { type: "Rest", muscles: [] },
            "Thursday": { type: "Upper B", muscles: ["Chest", "Back", "Shoulders", "Biceps", "Triceps"] },
            "Friday": { type: "Lower B", muscles: ["Legs", "Core", "Cardio"] },
            "Saturday": { type: "Rest", muscles: [] },
            "Sunday": { type: "Rest", muscles: [] }
        }
    },
    5: { // Push Pull Legs Upper Lower
        name: "PPL + Upper/Lower",
        schedule: {
            "Monday": { type: "Push", muscles: ["Chest", "Shoulders", "Triceps"] },
            "Tuesday": { type: "Pull", muscles: ["Back", "Biceps"] },
            "Wednesday": { type: "Legs", muscles: ["Legs", "Core"] },
            "Thursday": { type: "Upper", muscles: ["Chest", "Back", "Shoulders", "Biceps", "Triceps"] },
            "Friday": { type: "Lower", muscles: ["Legs", "Core", "Cardio"] },
            "Saturday": { type: "Rest", muscles: [] },
            "Sunday": { type: "Rest", muscles: [] }
        }
    },
    6: { // Push Pull Legs x2
        name: "Push/Pull/Legs x2",
        schedule: {
            "Monday": { type: "Push", muscles: ["Chest", "Shoulders", "Triceps"] },
            "Tuesday": { type: "Pull", muscles: ["Back", "Biceps"] },
            "Wednesday": { type: "Legs", muscles: ["Legs", "Core"] },
            "Thursday": { type: "Push", muscles: ["Chest", "Shoulders", "Triceps"] },
            "Friday": { type: "Pull", muscles: ["Back", "Biceps"] },
            "Saturday": { type: "Legs", muscles: ["Legs", "Core", "Cardio"] },
            "Sunday": { type: "Rest", muscles: [] }
        }
    },
    7: { // Split with active recovery
        name: "PPL + Specialization",
        schedule: {
            "Monday": { type: "Push", muscles: ["Chest", "Shoulders", "Triceps"] },
            "Tuesday": { type: "Pull", muscles: ["Back", "Biceps"] },
            "Wednesday": { type: "Legs", muscles: ["Legs", "Core"] },
            "Thursday": { type: "Push", muscles: ["Chest", "Shoulders", "Triceps"] },
            "Friday": { type: "Pull", muscles: ["Back", "Biceps"] },
            "Saturday": { type: "Legs", muscles: ["Legs", "Core"] },
            "Sunday": { type: "Active Recovery", muscles: ["Cardio", "Core"] }
        }
    }
};

// ==========================================
// EXERCISE SELECTION LOGIC
// ==========================================

/**
 * Get the goal category for exercise selection
 */
function getGoalCategory(goal) {
    switch (goal) {
        case 'lose_fat':
            return 'fatLoss';
        case 'build_muscle':
            return 'buildMuscle';
        case 'recomp':
        case 'general_fitness':
        default:
            return 'general';
    }
}

/**
 * Filter exercises based on user's equipment and injuries
 */
function filterExercises(exercises, userEquipment, userInjuries = []) {
    return exercises.filter(exercise => {
        // Check equipment compatibility
        const hasEquipment = exercise.equipment.includes(userEquipment);

        // Check for injury conflicts
        const hasInjuryConflict = userInjuries.some(injury =>
            exercise.injuries.includes(injury)
        );

        return hasEquipment && !hasInjuryConflict;
    });
}

/**
 * Select exercises for a muscle group based on user profile
 */
function selectExercisesForMuscle(muscle, userProfile, count = 2) {
    const goalCategory = getGoalCategory(userProfile.goal);
    const equipment = userProfile.equipment || 'full_gym';
    const injuries = userProfile.injuries || [];

    // Get exercises for this muscle and goal
    const muscleExercises = EXERCISE_DATABASE[muscle];
    if (!muscleExercises) return [];

    let exercises = muscleExercises[goalCategory] || muscleExercises['general'];

    // Filter by equipment and injuries
    exercises = filterExercises(exercises, equipment, injuries);

    // If not enough exercises, try general category
    if (exercises.length < count && goalCategory !== 'general') {
        const generalExercises = filterExercises(
            muscleExercises['general'] || [],
            equipment,
            injuries
        );
        exercises = [...exercises, ...generalExercises];
    }

    // Remove duplicates
    exercises = exercises.filter((ex, index, self) =>
        index === self.findIndex(e => e.name === ex.name)
    );

    // Shuffle and select
    exercises = shuffleArray(exercises);

    // Adjust count based on experience
    let adjustedCount = count;
    if (userProfile.experience === 'beginner') {
        adjustedCount = Math.max(1, count - 1);
    } else if (userProfile.experience === 'advanced') {
        adjustedCount = count + 1;
    }

    return exercises.slice(0, adjustedCount);
}

/**
 * Shuffle array (Fisher-Yates)
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ==========================================
// MAIN WORKOUT GENERATOR FUNCTION
// ==========================================

/**
 * Generate a personalized weekly workout plan
 * @param {Object} userProfile - User's profile data
 * @returns {Object} - Weekly workout plan with exercises
 */
function generatePersonalizedWorkoutPlan(userProfile) {
    // Delegate entirely to the Rule Engine pipeline
    if (typeof generateRuleEnginePlan === 'function') {
        console.log("🔧 workout-generator: Delegating to Rule Engine...");
        return generateRuleEnginePlan(userProfile);
    }

    // Fallback if rule-engine.js failed to load
    console.error("❌ Rule Engine not available, using legacy generator");
    const frequency = userProfile.frequency || userProfile.training_frequency || 4;
    const template = SPLIT_TEMPLATES[Math.min(Math.max(frequency, 2), 7)];

    const weeklyPlan = {};
    const routineExercises = {};

    for (const [day, dayConfig] of Object.entries(template.schedule)) {
        if (dayConfig.type === "Rest") {
            weeklyPlan[day] = "Rest";
            continue;
        }

        weeklyPlan[day] = dayConfig.type;

        if (!routineExercises[dayConfig.type]) {
            const exercises = [];
            const isCardioFocused = userProfile.goal === 'lose_fat';

            for (const muscle of dayConfig.muscles) {
                let exerciseCount = 2;
                if (isCardioFocused) {
                    exerciseCount = muscle === 'Cardio' ? 3 : 1;
                } else if (userProfile.goal === 'build_muscle') {
                    exerciseCount = muscle === 'Cardio' ? 1 : 2;
                }

                const muscleExercises = selectExercisesForMuscle(muscle, userProfile, exerciseCount);
                exercises.push(...muscleExercises);
            }

            routineExercises[dayConfig.type] = exercises;
        }
    }

    return {
        splitName: template.name,
        weeklyPlan: weeklyPlan,
        routineExercises: routineExercises,
        userProfile: {
            goal: userProfile.goal,
            equipment: userProfile.equipment,
            experience: userProfile.experience,
            frequency: frequency,
            injuries: userProfile.injuries || []
        }
    };
}

/**
 * Get personalized exercises for a specific routine type
 */
function getPersonalizedRoutineExercises(routineName, cachedPlan) {
    if (routineName === "Rest") {
        return [];
    }

    if (cachedPlan && cachedPlan.routineExercises && cachedPlan.routineExercises[routineName]) {
        return cachedPlan.routineExercises[routineName];
    }

    return [];
}

/**
 * Get the workout type for a specific day
 */
function getPersonalizedDayPlan(dayName, cachedPlan) {
    if (cachedPlan && cachedPlan.weeklyPlan && cachedPlan.weeklyPlan[dayName]) {
        return cachedPlan.weeklyPlan[dayName];
    }
    return "Rest";
}

// ==========================================
// EXPORTS (for use in script.js)
// ==========================================

// Global variable to store active plan
let ACTIVE_PERSONALIZED_PLAN = null;

/**
 * Initialize personalized workout plan from user profile
 */
async function initializePersonalizedPlan() {
    try {
        // Try to get user profile from Supabase
        const { data: { session } } = await _supabase.auth.getSession();

        if (session) {
            const { data: profile, error } = await _supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profile && !error) {
                const userProfile = {
                    goal: profile.goal || 'general_fitness',
                    equipment: profile.equipment_access || 'full_gym',
                    experience: profile.experience_level || 'intermediate',
                    frequency: profile.training_frequency || 4,
                    injuries: profile.injuries || []
                };

                ACTIVE_PERSONALIZED_PLAN = generatePersonalizedWorkoutPlan(userProfile);

                // Save to localStorage for offline access
                localStorage.setItem('fitnotfat_personalized_plan', JSON.stringify(ACTIVE_PERSONALIZED_PLAN));

                console.log("✅ Personalized workout plan generated:", ACTIVE_PERSONALIZED_PLAN.splitName);
                return ACTIVE_PERSONALIZED_PLAN;
            }
        }

        // Fallback to localStorage
        const cachedPlan = localStorage.getItem('fitnotfat_personalized_plan');
        if (cachedPlan) {
            ACTIVE_PERSONALIZED_PLAN = JSON.parse(cachedPlan);
            console.log("📦 Using cached personalized plan:", ACTIVE_PERSONALIZED_PLAN.splitName);
            return ACTIVE_PERSONALIZED_PLAN;
        }

        // Ultimate fallback - default profile
        console.log("⚠️ No profile found, using default plan");
        ACTIVE_PERSONALIZED_PLAN = generatePersonalizedWorkoutPlan({
            goal: 'general_fitness',
            equipment: 'full_gym',
            experience: 'intermediate',
            frequency: 4,
            injuries: []
        });

        return ACTIVE_PERSONALIZED_PLAN;

    } catch (error) {
        console.error("Error initializing personalized plan:", error);

        // Fallback to localStorage
        const cachedPlan = localStorage.getItem('fitnotfat_personalized_plan');
        if (cachedPlan) {
            ACTIVE_PERSONALIZED_PLAN = JSON.parse(cachedPlan);
            return ACTIVE_PERSONALIZED_PLAN;
        }

        // Default fallback
        ACTIVE_PERSONALIZED_PLAN = generatePersonalizedWorkoutPlan({
            goal: 'general_fitness',
            equipment: 'full_gym',
            experience: 'intermediate',
            frequency: 4,
            injuries: []
        });

        return ACTIVE_PERSONALIZED_PLAN;
    }
}

/**
 * Regenerate plan (when user updates profile)
 */
async function regeneratePersonalizedPlan() {
    localStorage.removeItem('fitnotfat_personalized_plan');
    return await initializePersonalizedPlan();
}

/**
 * Get goal description for display
 */
function getGoalDescription(goal) {
    const descriptions = {
        'lose_fat': '🔥 Fat Loss - High intensity, cardiovascular focus',
        'build_muscle': '💪 Muscle Building - Heavy weights, controlled tempo',
        'recomp': '⚡ Strength Training - Heavy compounds, low reps, progressive overload',
        'general_fitness': '🎯 General Fitness - Functional, balanced training'
    };
    return descriptions[goal] || descriptions['general_fitness'];
}
