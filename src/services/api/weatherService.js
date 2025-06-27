import { toast } from 'react-toastify';

export const weatherService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date" } },
          { field: { Name: "temp_high" } },
          { field: { Name: "temp_low" } },
          { field: { Name: "conditions" } },
          { field: { Name: "precipitation" } }
        ]
      };

      const response = await apperClient.fetchRecords('weather', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  },

  async getById(date) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date" } },
          { field: { Name: "temp_high" } },
          { field: { Name: "temp_low" } },
          { field: { Name: "conditions" } },
          { field: { Name: "precipitation" } }
        ],
        where: [
          {
            FieldName: "date",
            Operator: "EqualTo",
            Values: [date]
          }
        ]
      };

      const response = await apperClient.fetchRecords('weather', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        throw new Error('Weather data not found');
      }

      return response.data[0];
    } catch (error) {
      console.error(`Error fetching weather data for date ${date}:`, error);
      throw error;
    }
  }
};