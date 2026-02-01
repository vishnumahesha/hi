import type { FaceAnalysisResponse } from '@/types/face-analysis';

export const mockFreeResponse: FaceAnalysisResponse = {
  photoQuality: {
    score: 82,
    issues: ['side_missing'],
    limitations: [
      {
        feature: 'symmetry',
        limitation: 'Selfie angle may affect symmetry accuracy',
        impact: 'moderate',
      },
      {
        feature: 'chin',
        limitation: 'Side profile needed for chin projection assessment',
        impact: 'significant',
      },
    ],
  },
  overall: {
    rating10: 7.2,
    confidence: 'medium',
    confidenceNote: 'Confidence could improve with side profile photo and more even lighting',
    summary:
      'Your facial features show good overall harmony with notable strengths in your eye area and skin quality. Some minor improvements in skincare routine and posture could enhance your appearance further.',
  },
  features: [
    {
      key: 'skin',
      label: 'Skin Quality',
      rating10: 7.5,
      confidence: 'high',
      strengths: ['Even skin tone', 'Good overall clarity'],
      imperfections: ['Minor texture visible in T-zone', 'Slight under-eye darkness'],
      why: ['Skin texture varies naturally across face zones'],
      fixes: [
        {
          title: 'Consistent skincare routine',
          type: 'low_cost',
          difficulty: 'easy',
          timeToSeeChange: '4-8 weeks',
          steps: ['Cleanse morning and night', 'Apply moisturizer daily', 'Use SPF 30+ sunscreen'],
        },
        {
          title: 'Hydration focus',
          type: 'no_cost',
          difficulty: 'easy',
          timeToSeeChange: '1-2 weeks',
          steps: ['Drink 8 glasses of water daily', 'Reduce sodium intake'],
        },
      ],
    },
    {
      key: 'eye_area',
      label: 'Eye Area',
      rating10: 7.8,
      confidence: 'high',
      strengths: ['Good eye symmetry', 'Attractive eye shape'],
      imperfections: ['Mild under-eye darkness', 'Slight puffiness'],
      why: ['Under-eye appearance affected by sleep and hydration'],
      fixes: [
        {
          title: 'Sleep optimization',
          type: 'no_cost',
          difficulty: 'easy',
          timeToSeeChange: '2-4 weeks',
          steps: ['Aim for 7-9 hours of sleep', 'Keep consistent sleep schedule'],
        },
        {
          title: 'Cold compress routine',
          type: 'no_cost',
          difficulty: 'easy',
          timeToSeeChange: 'Immediate temporary effect',
          steps: ['Apply cold spoons or cucumber for 10 minutes', 'Best in the morning'],
        },
      ],
    },
    {
      key: 'nose',
      label: 'Nose',
      rating10: 6.9,
      confidence: 'medium',
      photoLimitations: ['Front-only view limits profile assessment'],
      strengths: ['Proportionate to face width', 'Good bridge definition'],
      imperfections: ['Slight nostril asymmetry'],
      why: ['Minor nostril asymmetry is extremely common'],
      fixes: [
        {
          title: 'Contouring technique',
          type: 'low_cost',
          difficulty: 'moderate',
          timeToSeeChange: 'Immediate',
          steps: ['Use matte bronzer on sides', 'Highlight bridge center'],
        },
      ],
    },
    {
      key: 'lips',
      label: 'Lips',
      rating10: 7.1,
      confidence: 'high',
      strengths: ['Well-defined cupids bow', 'Natural fullness'],
      imperfections: ['Minor dryness visible'],
      why: ['Lip hydration affects appearance'],
      fixes: [
        {
          title: 'Hydration routine',
          type: 'no_cost',
          difficulty: 'easy',
          timeToSeeChange: '1 week',
          steps: ['Apply lip balm throughout day', 'Gentle exfoliation weekly'],
        },
      ],
    },
    {
      key: 'cheekbones',
      label: 'Cheekbones',
      rating10: 7.3,
      confidence: 'medium',
      photoLimitations: ['Lighting affects visibility of bone structure'],
      strengths: ['Good natural projection', 'Creates attractive contours'],
      imperfections: ['Could benefit from more definition'],
      why: ['Cheekbone visibility varies with body composition'],
      fixes: [
        {
          title: 'Facial exercises',
          type: 'no_cost',
          difficulty: 'easy',
          timeToSeeChange: '4-8 weeks',
          steps: ['Practice cheek lifts daily', 'Smile and hold for 10 seconds'],
        },
      ],
    },
    {
      key: 'jawline',
      label: 'Jawline',
      rating10: 6.8,
      confidence: 'medium',
      photoLimitations: ['Head position affects jawline assessment'],
      strengths: ['Decent definition', 'Good overall shape'],
      imperfections: ['Slightly soft definition in some angles'],
      why: ['Jawline definition affected by posture and body composition'],
      fixes: [
        {
          title: 'Improve posture',
          type: 'no_cost',
          difficulty: 'moderate',
          timeToSeeChange: '2-4 weeks',
          steps: ['Practice chin tucks', 'Avoid forward head posture'],
        },
      ],
    },
  ],
  harmony: {
    rating10: 7.3,
    confidence: 'medium',
    notes: [
      'Facial thirds appear well-balanced',
      'Good symmetry overall with minor variations',
    ],
  },
  symmetry: {
    rating10: 7.4,
    confidence: 'medium',
    photoLimitation: 'Selfie camera angle may introduce slight distortion',
    notes: [
      'Overall symmetry is within normal attractive range',
      'Minor natural variations present (common in all faces)',
    ],
    asymmetries: [
      {
        area: 'Eyes',
        description: 'Slight difference in eyelid crease height',
        severity: 'minimal',
      },
    ],
  },
  hair: {
    rating10: 7.0,
    confidence: 'high',
    notes: ['Current style suits face shape', 'Healthy appearance'],
    suggestions: ['Consider adding texture for more dimension'],
  },
  topFixes: [
    {
      title: 'Establish skincare routine',
      why: 'Consistent skincare improves multiple facial aspects simultaneously',
      impact: 'high',
      steps: [
        'Cleanse morning and night',
        'Moisturize daily',
        'Use SPF 30+ sunscreen',
      ],
    },
    {
      title: 'Optimize sleep and hydration',
      why: 'Sleep and water directly affect skin, under-eyes, and facial puffiness',
      impact: 'high',
      steps: [
        'Sleep 7-9 hours consistently',
        'Drink 8 glasses of water daily',
      ],
    },
    {
      title: 'Practice good posture',
      why: 'Posture affects jawline definition and overall appearance',
      impact: 'medium',
      steps: [
        'Keep shoulders back',
        'Practice chin tucks',
      ],
    },
  ],
  safety: {
    disclaimer:
      'This analysis provides estimated assessments based on photo analysis. Results may vary with different lighting, angles, and photo quality. Beauty is subjective and these ratings reflect general aesthetic guidelines, not personal worth.',
    tone: 'neutral',
    photoDisclaimer: 'For most accurate results, use front-facing photos with even lighting and add a side profile.',
  },
  tier: {
    isPremium: false,
    depth: 'free',
  },
};

export const mockPremiumResponse: FaceAnalysisResponse = {
  photoQuality: {
    score: 88,
    issues: [],
    limitations: [
      {
        feature: 'symmetry',
        limitation: 'Selfie angle introduces minor measurement variance',
        impact: 'minor',
      },
    ],
  },
  overall: {
    rating10: 7.2,
    confidence: 'high',
    confidenceNote: 'Good photo quality with both front and side views allows for comprehensive analysis',
    summary:
      'Your facial features demonstrate solid foundational structure with particularly strong eye symmetry and skin quality. The analysis identifies several high-impact opportunities for enhancement, primarily through consistent skincare and lifestyle optimizations. Your facial harmony scores above average, with balanced proportions in the mid-face region.',
  },
  features: [
    {
      key: 'skin',
      label: 'Skin Quality',
      rating10: 7.5,
      confidence: 'high',
      strengths: [
        'Even skin tone across face',
        'Good clarity and luminosity',
        'Minimal visible pores in most areas',
        'Healthy overall appearance',
      ],
      imperfections: [
        'Minor texture in T-zone area',
        'Slight under-eye darkness',
        'Occasional dryness around mouth',
      ],
      why: [
        'T-zone texture common due to higher oil production in that area',
        'Under-eye darkness often genetic or sleep-related, not a flaw',
        'Mouth area prone to dryness from frequent movement',
      ],
      subFeatures: [
        { name: 'Texture/Clarity', rating10: 7.3, note: 'Minor texture in T-zone', isStrength: false },
        { name: 'Tone Evenness', rating10: 8.0, note: 'Good even coloring', isStrength: true },
        { name: 'Under-eye Area', rating10: 6.8, note: 'Mild darkness present', isStrength: false },
        { name: 'Hydration', rating10: 7.2, note: 'Adequate but could improve', isStrength: false },
        { name: 'Pore Visibility', rating10: 7.8, note: 'Minimal visibility', isStrength: true },
      ],
      fixes: [
        {
          title: 'Complete skincare system',
          type: 'low_cost',
          difficulty: 'easy',
          timeToSeeChange: '6-8 weeks',
          steps: [
            'Morning: gentle cleanser → vitamin C serum → moisturizer → SPF 30+',
            'Evening: oil cleanser → water cleanser → retinol (every other night) → moisturizer',
            'Weekly: gentle AHA/BHA exfoliation',
          ],
        },
        {
          title: 'Under-eye treatment protocol',
          type: 'low_cost',
          difficulty: 'easy',
          timeToSeeChange: '4-6 weeks',
          steps: [
            'Use eye cream with caffeine and vitamin K',
            'Apply with ring finger using gentle tapping',
            'Keep product refrigerated for depuffing effect',
          ],
        },
        {
          title: 'Hydration optimization',
          type: 'no_cost',
          difficulty: 'easy',
          timeToSeeChange: '1-2 weeks',
          steps: [
            'Drink minimum 8 glasses of water daily',
            'Reduce sodium and alcohol intake',
            'Use humidifier in dry environments',
          ],
        },
      ],
    },
    {
      key: 'eye_area',
      label: 'Eye Area',
      rating10: 7.8,
      confidence: 'high',
      strengths: [
        'Excellent bilateral symmetry',
        'Attractive eye shape with balanced proportions',
        'Good limbal ring visibility',
        'Positive canthal tilt',
        'Well-positioned eyebrows',
      ],
      imperfections: [
        'Mild periorbital hyperpigmentation',
        'Slight infraorbital puffiness',
        'Minor lid hooding on left side',
      ],
      why: [
        'Dark circles often result from thin under-eye skin revealing vessels',
        'Puffiness can be caused by fluid retention or sleep position',
        'Slight lid asymmetry is within normal range (97%+ of people have this)',
      ],
      subFeatures: [
        { name: 'Under-eye Darkness', rating10: 6.8, note: 'Mild darkness, improvable', isStrength: false },
        { name: 'Puffiness', rating10: 7.2, note: 'Slight morning puffiness', isStrength: false },
        { name: 'Eye Openness', rating10: 8.2, note: 'Good palpebral aperture', isStrength: true },
        { name: 'Eye Shape', rating10: 8.5, note: 'Attractive almond shape', isStrength: true },
        { name: 'Canthal Tilt', rating10: 8.0, note: 'Positive tilt (attractive)', isStrength: true },
      ],
      fixes: [
        {
          title: 'Targeted eye cream routine',
          type: 'low_cost',
          difficulty: 'easy',
          timeToSeeChange: '4-8 weeks',
          steps: [
            'Choose cream with caffeine and vitamin K',
            'Apply with ring finger using gentle tapping',
            'Store in refrigerator for added depuffing',
            'Use morning and night consistently',
          ],
        },
        {
          title: 'Sleep optimization protocol',
          type: 'no_cost',
          difficulty: 'moderate',
          timeToSeeChange: '2-4 weeks',
          steps: [
            'Elevate head slightly during sleep',
            'Sleep on back to prevent fluid accumulation',
            'Maintain consistent 7-9 hour schedule',
            'Avoid screens 1 hour before bed',
          ],
        },
        {
          title: 'Cold therapy treatment',
          type: 'no_cost',
          difficulty: 'easy',
          timeToSeeChange: 'Immediate temporary',
          steps: [
            'Use chilled jade roller or ice globes',
            'Roll outward from inner corner for 2-3 minutes',
            'Apply before makeup for best results',
          ],
        },
      ],
    },
    {
      key: 'eyebrows',
      label: 'Eyebrows',
      rating10: 7.4,
      confidence: 'high',
      strengths: [
        'Good natural shape',
        'Appropriate thickness for face',
        'Well-positioned arch',
      ],
      imperfections: [
        'Minor asymmetry in arch height',
        'Slight sparseness at tails',
      ],
      why: [
        'Brow asymmetry is nearly universal and adds character',
        'Tail sparseness common, easily addressed with grooming',
      ],
      subFeatures: [
        { name: 'Thickness', rating10: 7.5, note: 'Good natural density', isStrength: true },
        { name: 'Symmetry', rating10: 7.0, note: 'Minor arch difference', isStrength: false },
        { name: 'Shape/Arch', rating10: 7.8, note: 'Flattering natural arch', isStrength: true },
        { name: 'Spacing', rating10: 7.5, note: 'Appropriate for eye width', isStrength: true },
        { name: 'Grooming', rating10: 7.2, note: 'Could be refined', isStrength: false },
      ],
      fixes: [
        {
          title: 'Professional shaping',
          type: 'low_cost',
          difficulty: 'easy',
          timeToSeeChange: 'Immediate',
          steps: [
            'Visit brow specialist for initial shape',
            'Maintain shape at home between visits',
            'Avoid over-plucking',
          ],
        },
        {
          title: 'Brow growth serum',
          type: 'low_cost',
          difficulty: 'easy',
          timeToSeeChange: '8-12 weeks',
          steps: [
            'Apply peptide-based brow serum nightly',
            'Focus on sparse areas',
            'Be consistent for best results',
          ],
        },
      ],
    },
    {
      key: 'nose',
      label: 'Nose',
      rating10: 6.9,
      confidence: 'medium',
      photoLimitations: ['Profile view would improve assessment accuracy'],
      strengths: [
        'Nose-to-face width ratio is proportionate',
        'Good dorsal definition',
        'Bridge width harmonizes with eye spacing',
      ],
      imperfections: [
        'Minor nostril asymmetry (common)',
        'Slight dorsal irregularity',
      ],
      why: [
        'Nostril asymmetry present in over 80% of faces',
        'Dorsal variations often only visible in certain lighting',
      ],
      subFeatures: [
        { name: 'Bridge', rating10: 7.2, note: 'Good definition', isStrength: true },
        { name: 'Tip', rating10: 6.8, note: 'Could have more refinement', isStrength: false },
        { name: 'Nostrils', rating10: 6.5, note: 'Minor asymmetry', isStrength: false },
        { name: 'Width', rating10: 7.3, note: 'Proportionate to face', isStrength: true },
        { name: 'Profile', rating10: 7.0, note: 'Assessment limited without side view', isStrength: false },
      ],
      fixes: [
        {
          title: 'Professional contouring',
          type: 'low_cost',
          difficulty: 'moderate',
          timeToSeeChange: 'Immediate',
          steps: [
            'Use cool-toned contour shade',
            'Apply thin lines along sides of nose',
            'Blend thoroughly upward',
            'Highlight bridge center',
          ],
        },
        {
          title: 'Strategic photography',
          type: 'no_cost',
          difficulty: 'easy',
          timeToSeeChange: 'Immediate',
          steps: [
            'Face camera at slight angle rather than straight-on',
            'Tilt chin slightly down for frontal photos',
            'Use soft, diffused lighting',
          ],
        },
      ],
    },
    {
      key: 'lips',
      label: 'Lips',
      rating10: 7.1,
      confidence: 'high',
      strengths: [
        'Well-defined vermillion border',
        'Attractive cupids bow shape',
        'Good upper-to-lower lip ratio',
        'Natural fullness suits face',
      ],
      imperfections: [
        'Minor vertical lip lines developing',
        'Slight dryness affecting texture',
      ],
      why: [
        'Lip lines develop from repetitive movements and sun exposure',
        'Dryness affects surface texture and light reflection',
      ],
      subFeatures: [
        { name: 'Upper Lip', rating10: 7.0, note: 'Good shape and definition', isStrength: true },
        { name: 'Lower Lip', rating10: 7.3, note: 'Natural fullness', isStrength: true },
        { name: 'Cupids Bow', rating10: 7.5, note: 'Well-defined', isStrength: true },
        { name: 'Symmetry', rating10: 7.2, note: 'Good balance', isStrength: true },
        { name: 'Hydration', rating10: 6.5, note: 'Shows dryness', isStrength: false },
      ],
      fixes: [
        {
          title: 'Intensive hydration protocol',
          type: 'low_cost',
          difficulty: 'easy',
          timeToSeeChange: '1-2 weeks',
          steps: [
            'Apply hyaluronic acid serum to damp lips',
            'Seal with occlusive lip balm',
            'Overnight lip mask 3x weekly',
            'Gentle sugar scrub exfoliation 2x weekly',
          ],
        },
        {
          title: 'Lip liner enhancement',
          type: 'low_cost',
          difficulty: 'moderate',
          timeToSeeChange: 'Immediate',
          steps: [
            'Choose liner matching natural lip color',
            'Slightly overdraw at cupids bow peak',
            'Define corners precisely',
            'Blend inward for natural gradient',
          ],
        },
      ],
    },
    {
      key: 'cheekbones',
      label: 'Cheekbones',
      rating10: 7.3,
      confidence: 'medium',
      photoLimitations: ['Lighting significantly affects cheekbone visibility'],
      strengths: [
        'Good malar projection',
        'Creates attractive facial contours',
        'Well-positioned at ideal height',
      ],
      imperfections: [
        'Could have more lateral projection',
        'Soft tissue coverage reduces bony prominence',
      ],
      why: [
        'Cheekbone prominence affected by body fat percentage',
        'Lighting dramatically impacts visibility of bone structure',
      ],
      subFeatures: [
        { name: 'Prominence', rating10: 7.2, note: 'Good natural projection', isStrength: true },
        { name: 'Position', rating10: 7.8, note: 'Ideal height placement', isStrength: true },
        { name: 'Definition', rating10: 6.8, note: 'Could be more defined', isStrength: false },
        { name: 'Hollows', rating10: 7.0, note: 'Subtle but present', isStrength: false },
      ],
      fixes: [
        {
          title: 'Lifestyle definition enhancement',
          type: 'no_cost',
          difficulty: 'moderate',
          timeToSeeChange: '8-16 weeks',
          steps: [
            'Reduce sodium intake to minimize water retention',
            'Avoid alcohol which causes facial bloating',
            'Stay consistently hydrated',
            'Consider slight caloric adjustment if appropriate',
          ],
        },
        {
          title: 'Gua sha sculpting routine',
          type: 'low_cost',
          difficulty: 'moderate',
          timeToSeeChange: '4-8 weeks',
          steps: [
            'Use jade or rose quartz gua sha tool',
            'Apply facial oil for glide',
            'Scrape upward along cheekbones',
            'Perform for 5 minutes daily',
          ],
        },
        {
          title: 'Professional contouring',
          type: 'low_cost',
          difficulty: 'moderate',
          timeToSeeChange: 'Immediate',
          steps: [
            'Apply contour in hollow beneath cheekbone',
            'Angle from ear toward mouth corner',
            'Add highlight on top of cheekbone',
          ],
        },
      ],
    },
    {
      key: 'jawline',
      label: 'Jawline',
      rating10: 6.8,
      confidence: 'medium',
      photoLimitations: ['Head position and lighting affect assessment'],
      strengths: [
        'Good overall mandibular shape',
        'Chin projection within normal range',
        'Gonial angle reasonably defined',
      ],
      imperfections: [
        'Definition softened by submental fullness',
        'Slight asymmetry in jaw angle projection',
      ],
      why: [
        'Submental area often shows softness due to posture',
        'Jaw asymmetry is common and often genetic',
        'Definition varies significantly with head position',
      ],
      subFeatures: [
        { name: 'Definition', rating10: 6.5, note: 'Somewhat soft', isStrength: false },
        { name: 'Gonial Angle', rating10: 7.0, note: 'Reasonable definition', isStrength: false },
        { name: 'Width', rating10: 7.2, note: 'Proportionate', isStrength: true },
        { name: 'Symmetry', rating10: 6.8, note: 'Minor asymmetry', isStrength: false },
      ],
      fixes: [
        {
          title: 'Mewing technique',
          type: 'no_cost',
          difficulty: 'moderate',
          timeToSeeChange: '6-12 months',
          steps: [
            'Rest entire tongue against roof of mouth',
            'Keep teeth lightly touching',
            'Breathe through nose',
            'Practice consistently throughout day',
          ],
        },
        {
          title: 'Neck and jaw exercises',
          type: 'no_cost',
          difficulty: 'easy',
          timeToSeeChange: '4-8 weeks',
          steps: [
            'Chin tucks: pull chin back, hold 5 seconds',
            'Jaw releases: open wide, close slowly',
            'Neck stretches: tilt back, push jaw forward',
            'Perform 15-20 reps daily',
          ],
        },
        {
          title: 'Reduce facial bloating',
          type: 'no_cost',
          difficulty: 'moderate',
          timeToSeeChange: '1-2 weeks',
          steps: [
            'Reduce sodium significantly',
            'Limit alcohol consumption',
            'Elevate head during sleep',
            'Daily lymphatic massage',
          ],
        },
      ],
    },
    {
      key: 'chin',
      label: 'Chin',
      rating10: 7.0,
      confidence: 'medium',
      photoLimitations: ['Side profile needed for accurate projection assessment'],
      strengths: [
        'Proportionate chin height',
        'Good overall shape',
      ],
      imperfections: [
        'Forward projection could be slightly stronger',
      ],
      why: [
        'Chin projection significantly affected by camera angle',
        'True assessment requires side profile view',
      ],
      subFeatures: [
        { name: 'Forward Projection', rating10: 6.8, note: 'Slightly recessed', isStrength: false },
        { name: 'Height', rating10: 7.2, note: 'Proportionate', isStrength: true },
        { name: 'Width', rating10: 7.3, note: 'Balanced', isStrength: true },
        { name: 'Symmetry', rating10: 7.0, note: 'Minor variation', isStrength: false },
      ],
      fixes: [
        {
          title: 'Posture correction',
          type: 'no_cost',
          difficulty: 'moderate',
          timeToSeeChange: '4-8 weeks',
          steps: [
            'Avoid forward head posture',
            'Keep chin parallel to ground',
            'Practice chin tucks regularly',
          ],
        },
      ],
    },
    {
      key: 'neck_posture',
      label: 'Neck & Posture',
      rating10: 6.5,
      confidence: 'medium',
      strengths: [
        'No severe postural issues visible',
      ],
      imperfections: [
        'Slight forward head posture detected',
        'Could improve neck-jaw angle',
      ],
      why: [
        'Forward head posture extremely common in modern lifestyle',
        'Posture directly affects perceived jawline definition',
      ],
      subFeatures: [
        { name: 'Forward Head Posture', rating10: 6.0, note: 'Slight forward position', isStrength: false },
        { name: 'Neck Angle', rating10: 6.8, note: 'Could be improved', isStrength: false },
        { name: 'Shoulder Position', rating10: 7.0, note: 'Reasonably aligned', isStrength: false },
      ],
      fixes: [
        {
          title: 'Posture correction program',
          type: 'no_cost',
          difficulty: 'moderate',
          timeToSeeChange: '4-12 weeks',
          steps: [
            'Set hourly posture reminders',
            'Practice chin tucks throughout day',
            'Strengthen neck muscles with exercises',
            'Adjust workstation ergonomics',
          ],
        },
      ],
    },
  ],
  harmony: {
    rating10: 7.3,
    confidence: 'high',
    notes: [
      'Facial thirds are well-balanced',
      'Eye spacing to nose width ratio is favorable',
      'Overall proportions within attractive range',
      'Features complement each other well',
    ],
    facialThirds: {
      upper: 'Proportionate forehead height',
      middle: 'Well-balanced midface',
      lower: 'Lower third slightly longer than ideal but within normal',
      balance: 'Good overall balance with minor variations',
    },
  },
  symmetry: {
    rating10: 7.4,
    confidence: 'medium',
    photoLimitation: 'Selfie angle introduces measurement variance; standardized photos recommended for precise symmetry analysis',
    notes: [
      'Overall symmetry is within attractive range',
      'Minor natural variations present (normal)',
      'No significant asymmetries detected',
    ],
    asymmetries: [
      {
        area: 'Eyes',
        description: 'Slight difference in eyelid crease height',
        severity: 'minimal',
      },
      {
        area: 'Eyebrows',
        description: 'Minor difference in arch height',
        severity: 'minimal',
      },
      {
        area: 'Nose',
        description: 'Subtle nostril size variation',
        severity: 'common',
      },
    ],
  },
  hair: {
    rating10: 7.0,
    confidence: 'high',
    notes: [
      'Current style complements face shape',
      'Hair texture appears healthy',
      'Good volume distribution',
    ],
    suggestions: [
      'Consider adding subtle layering for dimension',
      'Volumizing products at roots could enhance framing',
      'Regular trims every 6-8 weeks maintain optimal look',
    ],
  },
  topFixes: [
    {
      title: 'Comprehensive skincare routine',
      why: 'Addresses multiple skin concerns simultaneously with highest visible impact',
      impact: 'high',
      steps: [
        'Morning: cleanser → vitamin C → moisturizer → SPF 30+',
        'Evening: double cleanse → retinol (2-3x/week) → moisturizer',
        'Weekly: gentle exfoliation and hydrating mask',
      ],
    },
    {
      title: 'Sleep and recovery optimization',
      why: 'Directly impacts dark circles, puffiness, skin repair, and overall appearance',
      impact: 'high',
      steps: [
        'Establish consistent 7-9 hour sleep schedule',
        'Sleep on back with slightly elevated head',
        'Avoid screens and heavy meals before bed',
      ],
    },
    {
      title: 'Posture correction program',
      why: 'Improves jawline definition, neck angle, and overall appearance in photos',
      impact: 'high',
      steps: [
        'Practice mewing (tongue on roof of mouth)',
        'Set hourly posture reminders',
        'Strengthen neck muscles with exercises',
      ],
    },
    {
      title: 'Hydration and diet optimization',
      why: 'Reduces facial bloating, improves skin quality, enhances feature definition',
      impact: 'high',
      steps: [
        'Drink minimum 8 glasses of water daily',
        'Reduce sodium intake significantly',
        'Limit alcohol consumption',
      ],
    },
    {
      title: 'Daily facial massage',
      why: 'Reduces puffiness, improves circulation, enhances cheekbone/jawline definition',
      impact: 'medium',
      steps: [
        'Use gua sha or facial roller for 5 minutes daily',
        'Focus on jawline and cheekbone areas',
        'Best performed in morning',
      ],
    },
  ],
  safety: {
    disclaimer:
      'This analysis provides estimated assessments based on photo analysis using general aesthetic guidelines. Results may vary with different lighting, angles, and photo quality. These ratings reflect common aesthetic preferences and do not determine personal worth or attractiveness. Individual beauty is subjective and multifaceted.',
    tone: 'neutral',
    photoDisclaimer: 'Some measurements (symmetry, proportions) are estimates that can be affected by camera angle and lens distortion. Standardized photography would provide more precise measurements.',
  },
  tier: {
    isPremium: true,
    depth: 'premium',
  },
};

export function getMockResponse(isPremium: boolean): FaceAnalysisResponse {
  return isPremium ? mockPremiumResponse : mockFreeResponse;
}
