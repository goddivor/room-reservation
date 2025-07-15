/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/rooms/room-details.tsx
import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  Edit2,
  Trash,
  Calendar1,
  Clock,
  Location,
  Buildings2,
  People,
  Ruler,
  MoneyRecive,
  Wifi,
  Monitor,
  Camera,
  Lock1,
  Setting4,
  Star1,
  Heart,
  Share,
  More,
  Image,
  DocumentDownload,
} from "iconsax-react";
import Button from "@/components/Button";
import Modal, { type ModalRef } from "@/components/ui/Modal";

// Types
interface Room {
  id: string;
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
  hourlyRate?: number;
  description?: string;
  images: string[];
  rating: number;
  totalReviews: number;
  accessibility: {
    wheelchairAccessible: boolean;
    hearingLoop: boolean;
    braille: boolean;
  };
  rules: string[];
  createdAt: string;
  updatedAt: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
}

interface Reservation {
  id: string;
  title: string;
  user: {
    name: string;
    avatar?: string;
    department: string;
  };
  startTime: string;
  endTime: string;
  status: "confirmed" | "pending" | "cancelled";
  attendees: number;
  recurring?: boolean;
}

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
    role: string;
  };
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

const RoomDetailsPage: React.FC = () => {
  // Mock room data
  const [room] = useState<Room>({
    id: "1",
    name: "Salle Zeus",
    code: "CONF-001",
    type: "conference",
    building: "Bâtiment A",
    floor: 2,
    capacity: 50,
    area: 75,
    status: "available",
    amenities: ["wifi", "projector", "whiteboard", "ac", "coffee", "flipchart"],
    equipment: [
      "Projecteur 4K Ultra HD",
      "Système audio surround 7.1",
      'Écran de projection 85"',
      "Système de visioconférence",
      "Microphones sans fil (4)",
      "Tableau blanc interactif",
    ],
    hourlyRate: 45,
    description:
      "Grande salle de conférence moderne équipée des dernières technologies pour vos présentations importantes. Idéale pour les séminaires, formations et événements corporate.",
    images: [
      "/room-images/zeus-1.jpg",
      "/room-images/zeus-2.jpg",
      "/room-images/zeus-3.jpg",
      "/room-images/zeus-4.jpg",
    ],
    rating: 4.7,
    totalReviews: 24,
    accessibility: {
      wheelchairAccessible: true,
      hearingLoop: true,
      braille: false,
    },
    rules: [
      "Réservation minimum 1 heure",
      "Annulation possible jusqu'à 2h avant",
      "Pas de nourriture dans la salle",
      "Nettoyage obligatoire après usage",
      "Respect du matériel",
    ],
    createdAt: "2024-01-15",
    updatedAt: "2024-07-10",
    lastMaintenanceDate: "2024-06-15",
    nextMaintenanceDate: "2024-08-15",
  });

  // Mock reservations data
  const [upcomingReservations] = useState<Reservation[]>([
    {
      id: "1",
      title: "Réunion équipe Marketing",
      user: {
        name: "Marie Dubois",
        avatar: "/avatars/marie.jpg",
        department: "Marketing",
      },
      startTime: "2024-07-16T09:00:00",
      endTime: "2024-07-16T11:00:00",
      status: "confirmed",
      attendees: 12,
      recurring: false,
    },
    {
      id: "2",
      title: "Formation équipe commerciale",
      user: {
        name: "Thomas Martin",
        avatar: "/avatars/thomas.jpg",
        department: "Ventes",
      },
      startTime: "2024-07-16T14:00:00",
      endTime: "2024-07-16T17:00:00",
      status: "confirmed",
      attendees: 25,
      recurring: true,
    },
    {
      id: "3",
      title: "Présentation projet Q3",
      user: {
        name: "Sophie Laurent",
        avatar: "/avatars/sophie.jpg",
        department: "Direction",
      },
      startTime: "2024-07-17T10:30:00",
      endTime: "2024-07-17T12:00:00",
      status: "pending",
      attendees: 8,
      recurring: false,
    },
  ]);

  // Mock reviews data
  const [reviews] = useState<Review[]>([
    {
      id: "1",
      user: {
        name: "Alice Bernard",
        avatar: "/avatars/alice.jpg",
        role: "Chef de projet",
      },
      rating: 5,
      comment:
        "Salle parfaite pour nos formations ! Le matériel audiovisuel est excellent et la salle très confortable.",
      date: "2024-07-10",
      helpful: 8,
    },
    {
      id: "2",
      user: {
        name: "Marc Rousseau",
        avatar: "/avatars/marc.jpg",
        role: "Formateur",
      },
      rating: 4,
      comment:
        "Très bonne salle, seul bémol : la climatisation pourrait être plus silencieuse.",
      date: "2024-07-05",
      helpful: 3,
    },
  ]);

  const [activeTab, setActiveTab] = useState<
    "overview" | "reservations" | "reviews" | "maintenance"
  >("overview");
  //   const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryModalRef = useRef<ModalRef>(null);
  const bookingModalRef = useRef<ModalRef>(null);

  // Get status badge
  const getStatusBadge = (status: Room["status"]) => {
    const config = {
      available: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Disponible",
        icon: "🟢",
      },
      occupied: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Occupée",
        icon: "🔴",
      },
      maintenance: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Maintenance",
        icon: "🟡",
      },
      disabled: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Désactivée",
        icon: "⚫",
      },
    };

    const style = config[status];
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}
      >
        <span className="mr-1">{style.icon}</span>
        {style.label}
      </span>
    );
  };

  // Get type icon and label
  const getTypeInfo = (type: Room["type"]) => {
    const types = {
      conference: {
        icon: <Buildings2 size={24} color="#1D4ED8" />,
        label: "Salle de conférence",
        color: "text-blue-600",
      },
      meeting: {
        icon: <Location size={24} color="#059669" />,
        label: "Salle de réunion",
        color: "text-green-600",
      },
      training: {
        icon: <Monitor size={24} color="#D97706" />,
        label: "Salle de formation",
        color: "text-orange-600",
      },
      office: {
        icon: <Lock1 size={24} color="#7C3AED" />,
        label: "Bureau",
        color: "text-purple-600",
      },
    };
    return types[type];
  };

  // Get amenity details
  const getAmenityDetails = (amenity: string) => {
    const amenities: Record<
      string,
      { icon: React.ReactElement; label: string }
    > = {
      wifi: {
        icon: <Wifi size={20} color="#6B7280" />,
        label: "Wi-Fi haut débit",
      },
      projector: {
        icon: <Monitor size={20} color="#6B7280" />,
        label: "Projecteur",
      },
      camera: { icon: <Camera size={20} color="#6B7280" />, label: "Caméra" },
      whiteboard: {
        icon: <Edit2 size={20} color="#6B7280" />,
        label: "Tableau blanc",
      },
      ac: {
        icon: <Setting4 size={20} color="#6B7280" />,
        label: "Climatisation",
      },
      coffee: {
        icon: <MoneyRecive size={20} color="#6B7280" />,
        label: "Machine à café",
      },
      flipchart: {
        icon: <Edit2 size={20} color="#6B7280" />,
        label: "Paperboard",
      },
    };
    return (
      amenities[amenity] || {
        icon: <Setting4 size={20} color="#6B7280" />,
        label: amenity,
      }
    );
  };

  // Format date for reservations
  const formatReservationTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dateLabel = "";
    if (start.toDateString() === today.toDateString()) {
      dateLabel = "Aujourd'hui";
    } else if (start.toDateString() === tomorrow.toDateString()) {
      dateLabel = "Demain";
    } else {
      dateLabel = start.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    }

    const timeLabel = `${start.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${end.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    return { dateLabel, timeLabel };
  };

  // Handle actions
  const handleEdit = () => {
    console.log("Edit room:", room.id);
  };

  const handleDelete = () => {
    if (
      confirm(`Êtes-vous sûr de vouloir supprimer la salle "${room.name}" ?`)
    ) {
      console.log("Delete room:", room.id);
    }
  };

  const handleBookRoom = () => {
    bookingModalRef.current?.open();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    console.log("URL copied to clipboard");
  };

  const renderStarRating = (
    rating: number,
    size: "sm" | "md" | "lg" = "md"
  ) => {
    const sizes = { sm: 12, md: 16, lg: 20 };
    const starSize = sizes[size];

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star1
            key={star}
            size={starSize}
            color={star <= rating ? "#FCD34D" : "#E5E7EB"}
            variant={star <= rating ? "Bold" : "Outline"}
          />
        ))}
      </div>
    );
  };

  const typeInfo = getTypeInfo(room.type);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
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
          Salles › {room.building} › {room.name}
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative">
          {/* Room Image */}
          <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative">
            <div className="text-white text-center">
              <typeInfo.icon.type {...typeInfo.icon.props} size={48} />
              <div className="mt-2 text-sm opacity-75">
                Image non disponible
              </div>
            </div>

            {/* Image Controls */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                onClick={() => galleryModalRef.current?.open()}
                className="bg-black bg-opacity-20 text-white hover:bg-opacity-30"
              >
                <Image size={16} color="white" />
                <span>Galerie</span>
              </Button>
              <Button
                onClick={handleShare}
                className="bg-black bg-opacity-20 text-white hover:bg-opacity-30"
              >
                <Share size={16} color="white" />
              </Button>
            </div>

            {/* Status Badge */}
            <div className="absolute bottom-4 left-4">
              {getStatusBadge(room.status)}
            </div>
          </div>

          {/* Room Info */}
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <typeInfo.icon.type {...typeInfo.icon.props} />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {room.name}
                    </h1>
                    <p className="text-gray-600">
                      {room.code} • {typeInfo.label}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStarRating(room.rating)}
                    <span className="text-sm font-medium text-gray-700">
                      {room.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({room.totalReviews} avis)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Location size={16} color="currentColor" />
                    <span className="text-sm">
                      {room.building} - Étage {room.floor}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <People size={20} color="#6B7280" />
                    <span className="text-sm text-gray-700">
                      {room.capacity} personnes
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Ruler size={20} color="#6B7280" />
                    <span className="text-sm text-gray-700">{room.area}m²</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MoneyRecive size={20} color="#6B7280" />
                    <span className="text-sm text-gray-700">
                      {room.hourlyRate ? `${room.hourlyRate}€/h` : "Gratuit"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={20} color="#6B7280" />
                    <span className="text-sm text-gray-700">Réservable</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleEdit}
                  className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                >
                  <Edit2 size={16} color="currentColor" />
                  <span>Modifier</span>
                </Button>
                <Button
                  onClick={handleDelete}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash size={16} color="currentColor" />
                  <span>Supprimer</span>
                </Button>
                <Button
                  onClick={handleBookRoom}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={room.status !== "available"}
                >
                  <Calendar1 size={16} color="white" />
                  <span>Réserver</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              {
                key: "overview",
                label: "Vue d'ensemble",
                icon: <Location size={16} color="currentColor" />,
              },
              {
                key: "reservations",
                label: "Réservations",
                icon: <Calendar1 size={16} color="currentColor" />,
              },
              {
                key: "reviews",
                label: "Avis",
                icon: <Star1 size={16} color="currentColor" />,
              },
              {
                key: "maintenance",
                label: "Maintenance",
                icon: <Setting4 size={16} color="currentColor" />,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {room.description}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Equipment */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Équipements disponibles
                  </h3>
                  <div className="space-y-3">
                    {room.equipment.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <Monitor size={20} color="#059669" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Services inclus
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {room.amenities.map((amenity, index) => {
                      const amenityInfo = getAmenityDetails(amenity);
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          {amenityInfo.icon}
                          <span className="text-gray-700">
                            {amenityInfo.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Accessibility */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Accessibilité
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      room.accessibility.wheelchairAccessible
                        ? "bg-green-50 text-green-800"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>
                        {room.accessibility.wheelchairAccessible ? "✅" : "❌"}
                      </span>
                      <span className="text-sm font-medium">Accès PMR</span>
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      room.accessibility.hearingLoop
                        ? "bg-green-50 text-green-800"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>
                        {room.accessibility.hearingLoop ? "✅" : "❌"}
                      </span>
                      <span className="text-sm font-medium">
                        Boucle auditive
                      </span>
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      room.accessibility.braille
                        ? "bg-green-50 text-green-800"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{room.accessibility.braille ? "✅" : "❌"}</span>
                      <span className="text-sm font-medium">
                        Signalisation braille
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rules */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Règlement d'utilisation
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <ul className="space-y-2">
                    {room.rules.map((rule, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-2 text-sm text-yellow-800"
                      >
                        <span className="text-yellow-600 mt-0.5">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Reservations Tab */}
          {activeTab === "reservations" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Réservations à venir
                </h3>
                <Button
                  onClick={handleBookRoom}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={room.status !== "available"}
                >
                  <Calendar1 size={16} color="white" />
                  <span>Nouvelle réservation</span>
                </Button>
              </div>

              <div className="space-y-3">
                {upcomingReservations.map((reservation) => {
                  const { dateLabel, timeLabel } = formatReservationTime(
                    reservation.startTime,
                    reservation.endTime
                  );

                  return (
                    <div
                      key={reservation.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {reservation.title}
                            </h4>
                            {reservation.recurring && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Récurrent
                              </span>
                            )}
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                reservation.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : reservation.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {reservation.status === "confirmed"
                                ? "Confirmée"
                                : reservation.status === "pending"
                                ? "En attente"
                                : "Annulée"}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar1 size={14} color="currentColor" />
                              <span>{dateLabel}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={14} color="currentColor" />
                              <span>{timeLabel}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <People size={14} color="currentColor" />
                              <span>{reservation.attendees} participants</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 mt-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                              {reservation.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {reservation.user.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {reservation.user.department}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button className="text-gray-400 hover:text-gray-600">
                          <More size={16} color="currentColor" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {upcomingReservations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar1 size={48} color="#9CA3AF" />
                  <p className="mt-2">Aucune réservation à venir</p>
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Rating Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {room.rating}
                    </div>
                    <div className="flex items-center justify-center mt-1">
                      {renderStarRating(room.rating, "lg")}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {room.totalReviews} avis
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = Math.floor(Math.random() * 10) + 1;
                        const percentage = (count / room.totalReviews) * 100;

                        return (
                          <div
                            key={stars}
                            className="flex items-center space-x-3"
                          >
                            <div className="flex items-center space-x-1 w-12">
                              <span className="text-sm text-gray-600">
                                {stars}
                              </span>
                              <Star1 size={12} color="#FCD34D" variant="Bold" />
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {review.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium text-gray-900">
                              {review.user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {review.user.role}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              {renderStarRating(review.rating, "sm")}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(review.date).toLocaleDateString(
                                "fr-FR"
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3">{review.comment}</p>

                        <div className="flex items-center space-x-4">
                          <Button className="text-gray-500 hover:text-gray-700">
                            <Heart size={14} color="currentColor" />
                            <span className="text-xs">
                              Utile ({review.helpful})
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {reviews.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Star1 size={48} color="#9CA3AF" />
                  <p className="mt-2">Aucun avis pour cette salle</p>
                </div>
              )}
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === "maintenance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Maintenance Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">
                    Informations de maintenance
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">
                        Dernière maintenance:
                      </span>
                      <span className="font-medium text-blue-900">
                        {new Date(room.lastMaintenanceDate).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">
                        Prochaine maintenance:
                      </span>
                      <span className="font-medium text-blue-900">
                        {new Date(room.nextMaintenanceDate).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Actions rapides</h4>
                  <div className="space-y-2">
                    <Button className="w-full justify-start text-yellow-600 border-yellow-200 hover:bg-yellow-50">
                      <Setting4 size={16} color="currentColor" />
                      <span>Signaler un problème</span>
                    </Button>
                    <Button className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50">
                      <Calendar1 size={16} color="currentColor" />
                      <span>Programmer maintenance</span>
                    </Button>
                    <Button className="w-full justify-start text-green-600 border-green-200 hover:bg-green-50">
                      <DocumentDownload size={16} color="currentColor" />
                      <span>Télécharger rapport</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Maintenance History */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">
                  Historique des maintenances
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      date: "2024-06-15",
                      type: "Maintenance préventive",
                      description:
                        "Vérification et nettoyage du système de climatisation",
                      technician: "Jean Dubois",
                      status: "Terminée",
                    },
                    {
                      date: "2024-04-20",
                      type: "Réparation",
                      description: "Remplacement du projecteur défaillant",
                      technician: "Marie Martin",
                      status: "Terminée",
                    },
                    {
                      date: "2024-02-10",
                      type: "Maintenance préventive",
                      description: "Inspection générale des équipements",
                      technician: "Pierre Leclerc",
                      status: "Terminée",
                    },
                  ].map((maintenance, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h5 className="font-medium text-gray-900">
                              {maintenance.type}
                            </h5>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {maintenance.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {maintenance.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>
                              📅{" "}
                              {new Date(maintenance.date).toLocaleDateString(
                                "fr-FR"
                              )}
                            </span>
                            <span>👨‍🔧 {maintenance.technician}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Modal */}
      <Modal ref={galleryModalRef} title="Galerie de la salle" size="lg">
        <div className="p-6">
          <div className="text-center py-12 text-gray-500">
            <Image size={48} color="#9CA3AF" />
            <p className="mt-2">Aucune image disponible pour cette salle</p>
            <p className="text-sm">Les images seront ajoutées prochainement</p>
          </div>
        </div>
      </Modal>

      {/* Booking Modal */}
      <Modal ref={bookingModalRef} title="Réserver la salle" size="md">
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Calendar1 size={48} color="#9CA3AF" />
            <p className="mt-2">Interface de réservation</p>
            <p className="text-sm">
              Cette fonctionnalité sera implémentée dans la phase suivante
            </p>
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => bookingModalRef.current?.close()}
            >
              Fermer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoomDetailsPage;
