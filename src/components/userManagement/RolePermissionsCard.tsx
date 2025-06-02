
import React from 'react';
import { Check, Info } from 'lucide-react';
import { roleDescriptions, UserRole } from './userManagementUtils';

interface RolePermissionsCardProps {
  selectedRole: UserRole;
}

const RolePermissionsCard: React.FC<RolePermissionsCardProps> = ({ selectedRole }) => {
  return (
    <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-600">
      <div className="flex items-start space-x-3">
        <Info className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-white mb-2">
            {roleDescriptions[selectedRole].title}
          </h4>
          <p className="text-slate-300 text-sm mb-3">
            {roleDescriptions[selectedRole].description}
          </p>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-2">
              Permissions:
            </p>
            <ul className="space-y-1">
              {roleDescriptions[selectedRole].permissions.map((permission, index) => (
                <li key={index} className="flex items-center text-sm text-slate-300">
                  <Check className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                  {permission}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionsCard;
