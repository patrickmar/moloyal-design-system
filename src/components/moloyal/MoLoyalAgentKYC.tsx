import React, { useState } from 'react';
import { MoLoyalButton } from './MoLoyalButton';
import { MoLoyalInput } from './MoLoyalInput';
import { MoLoyalToast } from './MoLoyalToast';
import { UIIcons, SecurityIcons, MilitaryIcons } from './MoLoyalIcons';

interface MoLoyalAgentKYCProps {
  agent: any;
  onBack: () => void;
  onKYCComplete: (kycData: any) => void;
}

export function MoLoyalAgentKYC({ agent, onBack, onKYCComplete }: MoLoyalAgentKYCProps) {
  const [bvn, setBvn] = useState(agent.bvn || '');
  const [businessName, setBusinessName] = useState(agent.businessName || '');
  const [address, setAddress] = useState(agent.location?.address || '');
  const [photo, setPhoto] = useState(agent.avatar || null);
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const [location, setLocation] = useState(agent.location || null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCaptureLocation = () => {
    setIsCapturingLocation(true);
    
    // Simulate geo-location capture
    setTimeout(() => {
      const mockLocation = {
        latitude: 9.0579 + (Math.random() - 0.5) * 0.01,
        longitude: 8.6796 + (Math.random() - 0.5) * 0.01,
        address: address || 'Current location captured',
        timestamp: new Date().toISOString()
      };
      
      setLocation(mockLocation);
      setIsCapturingLocation(false);
      MoLoyalToast.success('Location Captured', 'GPS coordinates recorded');
    }, 2000);
  };

  const handleCapturePhoto = () => {
    setIsCapturingPhoto(true);
    
    // Simulate photo capture
    setTimeout(() => {
      setPhoto('data:image/png;base64,captured_photo_placeholder');
      setIsCapturingPhoto(false);
      MoLoyalToast.success('Photo Captured', 'Agent photo updated');
    }, 1500);
  };

  const handleSave = () => {
    if (!bvn || !businessName || !location) {
      MoLoyalToast.error('Incomplete', 'Please fill all required fields');
      return;
    }

    setIsSaving(true);

    // Simulate saving KYC data
    setTimeout(() => {
      const kycData = {
        bvn,
        businessName,
        address,
        location,
        photo,
        updatedAt: new Date().toISOString()
      };

      setIsSaving(false);
      onKYCComplete(kycData);
    }, 2000);
  };

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b px-4 py-3 flex items-center gap-3">
        <MoLoyalButton variant="ghost" size="small" onClick={onBack}>
          <UIIcons.ArrowLeft className="h-4 w-4" />
        </MoLoyalButton>
        <div>
          <h1 className="font-semibold">Agent KYC</h1>
          <p className="text-xs text-muted-foreground">Update your information</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Current Status */}
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{agent.name}</h3>
              <p className="text-sm text-muted-foreground">Agent ID: {agent.agentCode}</p>
            </div>
            <div className="flex items-center gap-2">
              <UIIcons.CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Verified</span>
            </div>
          </div>
        </div>

        {/* BVN Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <SecurityIcons.Shield className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Bank Verification Number</h3>
          </div>
          
          <MoLoyalInput
            label="BVN"
            placeholder="Enter your 11-digit BVN"
            value={bvn}
            onChange={(e) => setBvn(e.target.value)}
            type="number"
            helperText="Required for identity verification"
            maxLength={11}
          />
        </div>

        {/* Business Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MilitaryIcons.Building className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Business Information</h3>
          </div>
          
          <MoLoyalInput
            label="Business Name"
            placeholder="Enter your business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            helperText="Name displayed to customers"
          />

          <MoLoyalInput
            label="Business Address"
            placeholder="Enter your business address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            helperText="Physical location of your business"
          />
        </div>

        {/* Location Capture */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MilitaryIcons.MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Location Verification</h3>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            {location ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600">
                  <UIIcons.CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Location Captured</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Lat: {location.latitude?.toFixed(6)}</p>
                  <p>Lng: {location.longitude?.toFixed(6)}</p>
                  <p className="text-xs mt-1">
                    {new Date(location.timestamp || Date.now()).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full">
                  <MilitaryIcons.MapPin className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Capture your current GPS location
                </p>
              </div>
            )}
            
            <MoLoyalButton
              variant={location ? "secondary" : "primary"}
              onClick={handleCaptureLocation}
              disabled={isCapturingLocation}
              className="w-full mt-3"
            >
              {isCapturingLocation ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin">
                    <UIIcons.Clock className="h-4 w-4" />
                  </div>
                  Getting Location...
                </div>
              ) : (
                location ? 'Update Location' : 'Capture Location'
              )}
            </MoLoyalButton>
          </div>
        </div>

        {/* Photo Capture */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UIIcons.Camera className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Agent Photo</h3>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            {photo ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600">
                  <UIIcons.CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Photo Captured</span>
                </div>
                <div className="w-24 h-24 bg-muted rounded border mx-auto flex items-center justify-center">
                  <UIIcons.User className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full">
                  <UIIcons.Camera className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Take a clear photo of yourself
                </p>
              </div>
            )}
            
            <MoLoyalButton
              variant={photo ? "secondary" : "primary"}
              onClick={handleCapturePhoto}
              disabled={isCapturingPhoto}
              className="w-full mt-3"
            >
              {isCapturingPhoto ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin">
                    <UIIcons.Clock className="h-4 w-4" />
                  </div>
                  Taking Photo...
                </div>
              ) : (
                photo ? 'Retake Photo' : 'Take Photo'
              )}
            </MoLoyalButton>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <SecurityIcons.Shield className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Data Security</span>
          </div>
          <p className="text-sm text-blue-700">
            Your information is encrypted and stored securely. We use this data only 
            for verification and compliance purposes.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-4 border-t">
        <MoLoyalButton
          variant="primary"
          size="large"
          onClick={handleSave}
          disabled={isSaving || !bvn || !businessName || !location}
          className="w-full"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin">
                <UIIcons.Clock className="h-4 w-4" />
              </div>
              Saving Changes...
            </div>
          ) : (
            'Save KYC Information'
          )}
        </MoLoyalButton>
      </div>
    </div>
  );
}