import { useQuery } from '@tanstack/react-query';
import { DashboardData } from '../../public/data/dataTypes';

const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await fetch('/data/data.json');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return response.json();
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });
};

export const useSalesData = () => {
  const { data, isLoading, error } = useDashboardData();
  return {
    sales: data?.sales || [],
    isLoading,
    error,
  };
};

export const useCategoryData = () => {
  const { data, isLoading, error } = useDashboardData();
  return {
    categories: data?.categories || [],
    isLoading,
    error,
  };
};

export const useOrderStatusData = () => {
  const { data, isLoading, error } = useDashboardData();
  return {
    orderStatus: data?.orderStatus || [],
    isLoading,
    error,
  };
};

export const useProductPerformanceData = () => {
  const { data, isLoading, error } = useDashboardData();
  return {
    productPerformance: data?.productPerformance || [],
    isLoading,
    error,
  };
};