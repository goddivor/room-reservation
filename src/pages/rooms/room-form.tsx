/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/rooms/room-form.tsx
import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  Save2,
  Add,
  Trash,
  Image,
  Location,
  Buildings2,
  Monitor,
  People,
  Ruler,
  MoneyRecive,
  Wifi,
  Camera,
  Lock1,
  Setting4,
  DocumentUpload,
  CloseSquare,
  TickCircle,
  InfoCircle,
} from "iconsax-react";
import Button from "@/components/Button";
import Modal, { type ModalRef } from "@/components/ui/Modal";
import { Input } from "@/components/Input";

// Types
interface RoomFormData {
  name: string;
  code: string;
  type: "conference" | "meeting" | "training" | "office";
  building: string;
  floor: number;
  capacity: number;
  area: number;
  status: "available" | "occupied" | "maintenance" | "disabled";
  amenities: string[];
  equipment: string[];
  hourlyRate: number;
  description: string;
  accessibility: {
    wheelchairAccessible: boolean;
    hearingLoop: boolean;
    braille: boolean;
  };
  rules: string[];
  images: File[];
}

interface ValidationErrors {
  [key: string]: string;
}

const RoomFormPage: React.FC = () => {
  // Check if we're in edit mode (would come from URL params in real app)
  const isEditMode = window.location.pathname.includes("/edit");

  const [formData, setFormData] = useState<RoomFormData>({
    name: isEditMode ? "Salle Zeus" : "",
    code: isEditMode ? "CONF-001" : "",
    type: isEditMode ? "conference" : "meeting",
    building: isEditMode ? "Bâtiment A" : "",
    floor: isEditMode ? 2 : 1,
    capacity: isEditMode ? 50 : 10,
    area: isEditMode ? 75 : 25,
    status: "available",
    amenities: isEditMode
      ? ["wifi", "projector", "whiteboard", "ac"]
      : ["wifi"],
    equipment: isEditMode
      ? ["Projecteur 4K", "Système audio", 'Écran 85"']
      : [],
    hourlyRate: isEditMode ? 45 : 0,
    description: isEditMode
      ? "Grande salle de conférence avec équipement haut de gamme"
      : "",
    accessibility: {
      wheelchairAccessible: isEditMode ? true : false,
      hearingLoop: isEditMode ? true : false,
      braille: false,
    },
    rules: isEditMode
      ? [
          "Réservation minimum 1 heure",
          "Annulation possible jusqu'à 2h avant",
          "Pas de nourriture dans la salle",
        ]
      : [],
    images: [],
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [newEquipment, setNewEquipment] = useState("");
  const [newRule, setNewRule] = useState("");

  const equipmentModalRef = useRef<ModalRef>(null);
  const rulesModalRef = useRef<ModalRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form options
  const typeOptions = [
    {
      value: "conference",
      label: "Salle de conférence",
      icon: <Buildings2 size={16} color="#1D4ED8" />,
    },
    {
      value: "meeting",
      label: "Salle de réunion",
      icon: <Location size={16} color="#059669" />,
    },
    {
      value: "training",
      label: "Salle de formation",
      icon: <Monitor size={16} color="#D97706" />,
    },
    {
      value: "office",
      label: "Bureau",
      icon: <Lock1 size={16} color="#7C3AED" />,
    },
  ];

  const buildingOptions = [
    "Bâtiment A",
    "Bâtiment B",
    "Bâtiment C",
    "Bâtiment D",
  ];

  const statusOptions = [
    { value: "available", label: "Disponible", color: "text-green-600" },
    { value: "occupied", label: "Occupée", color: "text-red-600" },
    { value: "maintenance", label: "Maintenance", color: "text-yellow-600" },
    { value: "disabled", label: "Désactivée", color: "text-gray-600" },
  ];

  const availableAmenities = [
    {
      id: "wifi",
      label: "Wi-Fi haut débit",
      icon: <Wifi size={16} color="#6B7280" />,
    },
    {
      id: "projector",
      label: "Projecteur",
      icon: <Monitor size={16} color="#6B7280" />,
    },
    {
      id: "camera",
      label: "Caméra de visioconférence",
      icon: <Camera size={16} color="#6B7280" />,
    },
    {
      id: "whiteboard",
      label: "Tableau blanc",
      icon: <Setting4 size={16} color="#6B7280" />,
    },
    {
      id: "ac",
      label: "Climatisation",
      icon: <Setting4 size={16} color="#6B7280" />,
    },
    {
      id: "coffee",
      label: "Machine à café",
      icon: <MoneyRecive size={16} color="#6B7280" />,
    },
    {
      id: "flipchart",
      label: "Paperboard",
      icon: <Setting4 size={16} color="#6B7280" />,
    },
    {
      id: "sound",
      label: "Système audio",
      icon: <Monitor size={16} color="#6B7280" />,
    },
  ];

  // Validation
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom de la salle est requis";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Le code de la salle est requis";
    }

    if (!formData.building.trim()) {
      newErrors.building = "Le bâtiment est requis";
    }

    if (formData.capacity < 1) {
      newErrors.capacity = "La capacité doit être supérieure à 0";
    }

    if (formData.area < 1) {
      newErrors.area = "La surface doit être supérieure à 0";
    }

    if (formData.hourlyRate < 0) {
      newErrors.hourlyRate = "Le tarif ne peut pas être négatif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Form data:", formData);

      // Navigate back to rooms list
      window.history.back();
    } catch (error) {
      console.error("Error saving room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle amenity toggle
  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  // Handle equipment management
  const addEquipment = () => {
    if (newEquipment.trim()) {
      setFormData((prev) => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment.trim()],
      }));
      setNewEquipment("");
      equipmentModalRef.current?.close();
    }
  };

  const removeEquipment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index),
    }));
  };

  // Handle rules management
  const addRule = () => {
    if (newRule.trim()) {
      setFormData((prev) => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()],
      }));
      setNewRule("");
      rulesModalRef.current?.close();
    }
  };

  const removeRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => window.history.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} color="currentColor" />
          <span>Retour</span>
        </Button>
        <div className="text-sm text-gray-500">
          Salles › {isEditMode ? "Modifier" : "Créer"}
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Buildings2 size={32} color="#1D4ED8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Modifier la salle" : "Créer une nouvelle salle"}
            </h1>
            <p className="text-gray-600">
              {isEditMode
                ? "Modifiez les informations de la salle"
                : "Remplissez les informations pour créer une nouvelle salle"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informations générales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la salle *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Buildings2 size={16} color="#6B7280" />
                </div>
                <Input
                  placeholder="Ex: Salle Zeus"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  error={errors.name}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code de la salle *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Setting4 size={16} color="#6B7280" />
                </div>
                <Input
                  placeholder="Ex: CONF-001"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, code: e.target.value }))
                  }
                  error={errors.code}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de salle *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Décrivez la salle, ses caractéristiques et ses usages..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Location & Capacity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Localisation et capacité
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bâtiment *
              </label>
              <select
                value={formData.building}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, building: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner...</option>
                {buildingOptions.map((building) => (
                  <option key={building} value={building}>
                    {building}
                  </option>
                ))}
              </select>
              {errors.building && (
                <p className="text-red-500 text-sm mt-1">{errors.building}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Étage *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Location size={16} color="#6B7280" />
                </div>
                <Input
                  type="number"
                  min="0"
                  value={formData.floor.toString()}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      floor: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacité (personnes) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <People size={16} color="#6B7280" />
                </div>
                <Input
                  type="number"
                  min="1"
                  value={formData.capacity.toString()}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      capacity: parseInt(e.target.value) || 0,
                    }))
                  }
                  error={errors.capacity}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surface (m²) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Ruler size={16} color="#6B7280" />
                </div>
                <Input
                  type="number"
                  min="1"
                  value={formData.area.toString()}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      area: parseInt(e.target.value) || 0,
                    }))
                  }
                  error={errors.area}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tarif horaire (€)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MoneyRecive size={16} color="#6B7280" />
              </div>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00 (gratuit si vide)"
                value={formData.hourlyRate.toString()}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hourlyRate: parseFloat(e.target.value) || 0,
                  }))
                }
                error={errors.hourlyRate}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Services et équipements
          </h2>

          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              Services inclus
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableAmenities.map((amenity) => (
                <label
                  key={amenity.id}
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.amenities.includes(amenity.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                    className="sr-only"
                  />
                  <div
                    className={`flex-shrink-0 ${
                      formData.amenities.includes(amenity.id)
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {amenity.icon}
                  </div>
                  <span
                    className={`text-sm ${
                      formData.amenities.includes(amenity.id)
                        ? "text-blue-900 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {amenity.label}
                  </span>
                  {formData.amenities.includes(amenity.id) && (
                    <TickCircle size={16} color="#059669" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Equipment List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-medium text-gray-900">
                Équipements spécialisés
              </h3>
              <Button
                type="button"
                onClick={() => equipmentModalRef.current?.open()}
              >
                <Add size={16} color="currentColor" />
                <span>Ajouter équipement</span>
              </Button>
            </div>

            <div className="space-y-2">
              {formData.equipment.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Monitor size={16} color="#6B7280" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeEquipment(index)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash size={16} color="currentColor" />
                  </Button>
                </div>
              ))}

              {formData.equipment.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <Monitor size={32} color="#9CA3AF" />
                  <p className="mt-2 text-sm">Aucun équipement ajouté</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Accessibilité
          </h2>

          <div className="space-y-4">
            {[
              {
                key: "wheelchairAccessible",
                label: "Accès pour personnes à mobilité réduite",
              },
              {
                key: "hearingLoop",
                label: "Boucle auditive pour malentendants",
              },
              { key: "braille", label: "Signalisation en braille" },
            ].map((option) => (
              <label
                key={option.key}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300"
              >
                <input
                  type="checkbox"
                  checked={
                    formData.accessibility[
                      option.key as keyof typeof formData.accessibility
                    ]
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      accessibility: {
                        ...prev.accessibility,
                        [option.key]: e.target.checked,
                      },
                    }))
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Règlement d'utilisation
            </h2>
            <Button type="button" onClick={() => rulesModalRef.current?.open()}>
              <Add size={16} color="currentColor" />
              <span>Ajouter règle</span>
            </Button>
          </div>

          <div className="space-y-2">
            {formData.rules.map((rule, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-start space-x-2 flex-1">
                  <InfoCircle
                    size={16}
                    color="#D97706"
                    className="mt-0.5 flex-shrink-0"
                  />
                  <span className="text-yellow-800 text-sm">{rule}</span>
                </div>
                <Button
                  type="button"
                  onClick={() => removeRule(index)}
                  className="text-red-600 hover:bg-red-50 ml-2"
                >
                  <Trash size={16} color="currentColor" />
                </Button>
              </div>
            ))}

            {formData.rules.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <InfoCircle size={32} color="#9CA3AF" />
                <p className="mt-2 text-sm">Aucune règle définie</p>
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Images de la salle
          </h2>

          <div className="space-y-4">
            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
            >
              <DocumentUpload size={32} color="#9CA3AF" />
              <p className="mt-2 text-sm text-gray-600">
                Cliquez pour ajouter des images de la salle
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Formats acceptés: JPG, PNG, WebP (max 5MB par image)
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center">
                        <Image size={32} color="#9CA3AF" />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <CloseSquare size={12} color="white" />
                    </Button>
                    <p className="mt-2 text-xs text-gray-600 truncate">
                      {image.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">* Champs obligatoires</div>
            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={() => window.history.back()}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enregistrement...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save2 size={16} color="white" />
                    <span>
                      {isEditMode ? "Mettre à jour" : "Créer la salle"}
                    </span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Equipment Modal */}
      <Modal ref={equipmentModalRef} title="Ajouter un équipement" size="md">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'équipement
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Monitor size={16} color="#6B7280" />
              </div>
              <Input
                placeholder="Ex: Projecteur 4K Ultra HD"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => {
                setNewEquipment("");
                equipmentModalRef.current?.close();
              }}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={addEquipment}
              disabled={!newEquipment.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Add size={16} color="white" />
              <span>Ajouter</span>
            </Button>
          </div>
        </div>
      </Modal>

      {/* Rules Modal */}
      <Modal ref={rulesModalRef} title="Ajouter une règle" size="md">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Règle d'utilisation
            </label>
            <textarea
              placeholder="Ex: Réservation minimum 1 heure"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => {
                setNewRule("");
                rulesModalRef.current?.close();
              }}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={addRule}
              disabled={!newRule.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Add size={16} color="white" />
              <span>Ajouter</span>
            </Button>
          </div>
        </div>
      </Modal>

      {/* Success/Error Messages would go here in a real app */}
      {Object.keys(errors).length > 0 && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <InfoCircle size={16} color="currentColor" />
            <span className="text-sm font-medium">
              Veuillez corriger les erreurs dans le formulaire
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomFormPage;
