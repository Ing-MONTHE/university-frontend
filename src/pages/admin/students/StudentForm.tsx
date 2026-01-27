import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  BookOpen,
  Users,
} from 'lucide-react';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => void;
  student?: StudentFormData | null;
  isLoading?: boolean;
}

export interface StudentFormData {
  id?: number;
  matricule?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: 'M' | 'F';
  address: string;
  city: string;
  class_id: string;
  guardian_name?: string;
  guardian_phone?: string;
  emergency_contact?: string;
}

export default function StudentForm({
  isOpen,
  onClose,
  onSubmit,
  student = null,
  isLoading = false,
}: StudentFormProps) {
  
  const [formData, setFormData] = useState<StudentFormData>(
    student || {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: 'M',
      address: '',
      city: '',
      class_id: '',
      guardian_name: '',
      guardian_phone: '',
      emergency_contact: '',
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StudentFormData, string>> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Le prénom est requis';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'La date de naissance est requise';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }
    if (!formData.class_id) {
      newErrors.class_id = 'La classe est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Reset form
  const handleClose = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: 'M',
      address: '',
      city: '',
      class_id: '',
      guardian_name: '',
      guardian_phone: '',
      emergency_contact: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={student ? 'Modifier l\'étudiant' : 'Nouvel Étudiant'}
      size="lg"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" size="md" onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            {student ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Informations personnelles */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Informations personnelles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Prénom"
              type="text"
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              error={errors.first_name}
              icon={<User className="w-5 h-5" />}
              required
              fullWidth
            />

            <Input
              label="Nom"
              type="text"
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              error={errors.last_name}
              icon={<User className="w-5 h-5" />}
              required
              fullWidth
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
              required
              fullWidth
            />

            <Input
              label="Téléphone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
              icon={<Phone className="w-5 h-5" />}
              placeholder="+237 6XX XX XX XX"
              required
              fullWidth
            />

            <Input
              label="Date de naissance"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleChange('date_of_birth', e.target.value)}
              error={errors.date_of_birth}
              icon={<Calendar className="w-5 h-5" />}
              required
              fullWidth
            />

            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Genre <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Adresse
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Adresse complète"
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              error={errors.address}
              icon={<MapPin className="w-5 h-5" />}
              placeholder="Rue, Quartier..."
              required
              fullWidth
            />

            <Input
              label="Ville"
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              error={errors.city}
              icon={<MapPin className="w-5 h-5" />}
              placeholder="Ex: Douala, Yaoundé..."
              required
              fullWidth
            />
          </div>
        </div>

        {/* Académique */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Informations académiques
          </h3>
          
          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Classe <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.class_id}
              onChange={(e) => handleChange('class_id', e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
            >
              <option value="">Sélectionner une classe</option>
              <option value="1">L1 Informatique</option>
              <option value="2">L2 Informatique</option>
              <option value="3">L3 Informatique</option>
              <option value="4">L1 Économie</option>
              <option value="5">L2 Économie</option>
              <option value="6">L3 Économie</option>
            </select>
            {errors.class_id && (
              <p className="mt-1.5 text-sm text-red-600">{errors.class_id}</p>
            )}
          </div>
        </div>

        {/* Contact d'urgence */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Contact d'urgence (Optionnel)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom du tuteur"
              type="text"
              value={formData.guardian_name || ''}
              onChange={(e) => handleChange('guardian_name', e.target.value)}
              icon={<User className="w-5 h-5" />}
              fullWidth
            />

            <Input
              label="Téléphone du tuteur"
              type="tel"
              value={formData.guardian_phone || ''}
              onChange={(e) => handleChange('guardian_phone', e.target.value)}
              icon={<Phone className="w-5 h-5" />}
              placeholder="+237 6XX XX XX XX"
              fullWidth
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
