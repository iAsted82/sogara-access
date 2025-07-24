import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Users, MapPin, User, CheckCircle, XCircle } from 'lucide-react';
import { StaffMember } from '../../types/staff';

interface StaffPlanningProps {
  staff: StaffMember[];
  onUpdateAvailability: (staffMember: StaffMember) => void;
}

export const StaffPlanning: React.FC<StaffPlanningProps> = ({ staff, onUpdateAvailability }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week'>('day');
  
  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };
  
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get days of the week for week view
  const getDaysOfWeek = () => {
    const days = [];
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Start from Monday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      
      const isToday = day.toDateString() === new Date().toDateString();
      
      days.push({
        date: day,
        dayName: dayNames[day.getDay()],
        isToday
      });
    }
    
    return days;
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Format short date for week view
  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'numeric'
    });
  };
  
  const getRandomTimeSlots = (staffId: string, date: Date) => {
    // This is a mock function to generate random time slots
    // In a real app, this would come from a database
    
    // Use staff ID and date to create a deterministic but seemingly random value
    const seed = staffId.charCodeAt(staffId.length - 1) + date.getDate();
    
    // Generate 0-2 slots for this day
    const numSlots = seed % 3;
    const slots = [];
    
    // Working hours: 8:00 - 17:00
    const startHour = 8;
    const endHour = 17;
    
    for (let i = 0; i < numSlots; i++) {
      // Generate a random start time between 8:00 and 15:00
      const slotStartHour = startHour + (seed + i * 3) % (endHour - 2 - startHour);
      // Duration between 1-2 hours
      const duration = 1 + (seed + i) % 2;
      
      slots.push({
        start: `${slotStartHour}:00`,
        end: `${slotStartHour + duration}:00`,
        title: ['Réunion', 'Accueil', 'Formation', 'Traitement dossiers'][((seed + i) * 7) % 4]
      });
    }
    
    return slots;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header with navigation */}
      <div className="p-4 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900">Planning du Personnel</h3>
            <p className="text-sm text-blue-700">Gérer les disponibilités et horaires</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setCurrentView('day')}
              className={`px-3 py-1.5 text-sm ${currentView === 'day' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Jour
            </button>
            <button
              onClick={() => setCurrentView('week')}
              className={`px-3 py-1.5 text-sm ${currentView === 'week' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Semaine
            </button>
          </div>
        </div>
      </div>
      
      {/* Date navigation */}
      <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={goToPrevious}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <h4 className="font-medium text-gray-900">
            {currentView === 'day' 
              ? formatDate(currentDate)
              : `Semaine du ${formatDate(getDaysOfWeek()[0].date)} au ${formatDate(getDaysOfWeek()[6].date)}`
            }
          </h4>
          
          <button 
            onClick={goToNext}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        <button 
          onClick={goToToday}
          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
        >
          Aujourd'hui
        </button>
      </div>
      
      {/* Day View */}
      {currentView === 'day' && (
        <div className="p-4">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Personnel disponible</h4>
            <div className="space-y-3">
              {staff
                .filter(member => member.isAvailable)
                .map(member => {
                  const timeSlots = getRandomTimeSlots(member.id, currentDate);
                  
                  return (
                    <div 
                      key={member.id} 
                      className="p-3 bg-green-50 rounded-lg border border-green-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-green-200">
                            {member.avatar ? (
                              <img 
                                src={member.avatar} 
                                alt={`${member.firstName} ${member.lastName}`}
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <User className="h-6 w-6 text-green-600 m-2" />
                            )}
                          </div>
                          
                          <div>
                            <div className="font-medium text-gray-900">{member.firstName} {member.lastName}</div>
                            <div className="text-sm text-gray-600">{member.function}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{member.location || 'Non spécifié'}</span>
                          </div>
                          
                          <button 
                            onClick={() => onUpdateAvailability(member)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm flex items-center gap-1"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Marquer absent</span>
                          </button>
                        </div>
                      </div>
                      
                      {timeSlots.length > 0 && (
                        <div className="mt-3 pl-13">
                          <div className="text-xs text-gray-500 mb-1">Planning du jour:</div>
                          <div className="space-y-1.5">
                            {timeSlots.map((slot, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  <Clock className="h-3 w-3" />
                                  <span>{slot.start} - {slot.end}</span>
                                </div>
                                <span className="text-xs text-gray-700">{slot.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
              {staff.filter(member => member.isAvailable).length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <Users className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Aucun personnel disponible</p>
                  <p className="text-sm text-gray-500 mt-1">Tout le monde est occupé ou absent</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Personnel indisponible</h4>
            <div className="space-y-3">
              {staff
                .filter(member => !member.isAvailable)
                .map(member => (
                  <div 
                    key={member.id} 
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-200">
                          {member.avatar ? (
                            <img 
                              src={member.avatar} 
                              alt={`${member.firstName} ${member.lastName}`}
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <User className="h-6 w-6 text-gray-400 m-2" />
                          )}
                        </div>
                        
                        <div>
                          <div className="font-medium text-gray-900">{member.firstName} {member.lastName}</div>
                          <div className="text-sm text-gray-600">{member.function}</div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => onUpdateAvailability(member)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm flex items-center gap-1"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Marquer présent</span>
                      </button>
                    </div>
                  </div>
                ))}
                
              {staff.filter(member => !member.isAvailable).length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Tout le personnel est disponible</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Week View */}
      {currentView === 'week' && (
        <div className="p-4 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Week header */}
            <div className="grid grid-cols-8 gap-2 mb-3">
              <div className="p-2 font-medium text-gray-700">Personnel</div>
              {getDaysOfWeek().map((day, index) => (
                <div 
                  key={index}
                  className={`p-2 text-center ${day.isToday ? 'bg-blue-100 text-blue-800 font-medium rounded-lg' : 'text-gray-600'}`}
                >
                  <div className="text-sm font-medium">{day.dayName}</div>
                  <div className="text-xs">{formatShortDate(day.date)}</div>
                </div>
              ))}
            </div>
            
            {/* Staff rows */}
            {staff.map(member => (
              <div key={member.id} className="grid grid-cols-8 gap-2 mb-2 border-t border-gray-100 pt-2">
                {/* Staff info */}
                <div className="p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {member.avatar ? (
                        <img 
                          src={member.avatar} 
                          alt={`${member.firstName} ${member.lastName}`}
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-400 m-1.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{member.firstName} {member.lastName}</div>
                      <div className="text-xs text-gray-500 truncate">{member.function}</div>
                    </div>
                  </div>
                </div>
                
                {/* Days */}
                {getDaysOfWeek().map((day, index) => {
                  const isAvailable = day.date.getDay() !== 0 && day.date.getDay() !== 6 && Math.random() > 0.3;
                  const timeSlots = getRandomTimeSlots(member.id, day.date);
                  
                  return (
                    <div 
                      key={index}
                      className={`p-2 ${day.isToday ? 'bg-blue-50 rounded-lg' : ''} ${isAvailable ? 'bg-green-50/50' : 'bg-gray-50/50'}`}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex items-center justify-center mb-1">
                          {isAvailable ? (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span>Disponible</span>
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                              <span>Absent</span>
                            </span>
                          )}
                        </div>
                        
                        {isAvailable && timeSlots.length > 0 && (
                          <div className="space-y-1 mt-1">
                            {timeSlots.map((slot, slotIndex) => (
                              <div 
                                key={slotIndex} 
                                className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-center truncate"
                                title={`${slot.title}: ${slot.start} - ${slot.end}`}
                              >
                                {slot.start}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Disponible</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>Indisponible</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Rendez-vous/Réunion</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Formation</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Congé</span>
          </div>
        </div>
      </div>
    </div>
  );
};