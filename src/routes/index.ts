import { Router, Request, Response } from 'express';
import AdmissionRoutes from './Admission.route'; 
import contactRoutes from './contact.routes'; 
import courseRoutes from './course.routes'; 
import faqRoutes from './faq.routes';
import reviewRoutes from './review.routes';
import userRoutes from './user.router';

const router = Router();

router.use('/api/studio/admission', AdmissionRoutes);
router.use('/api/studio/contact', contactRoutes);
router.use('/api/studio/course', courseRoutes);
router.use('/api/studio/faqs', faqRoutes);
router.use('/api/studio/review', reviewRoutes);
router.use('/api/studio/user', userRoutes);

// Health check endpoint
router.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({ status: 'healthy' });
});

// Root route
router.get('/', (_req: Request, res: Response): void => {
  res.json({ 
    message: 'Welcome to Raza Tech Solution API',
    status: 'operational'
  });
});

export default router;
