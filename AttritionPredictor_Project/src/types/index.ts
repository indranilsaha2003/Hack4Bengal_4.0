export interface Employee {
  Age: number;
  Attrition: string;
  BusinessTravel: string;
  DailyRate: number;
  Department: string;
  DistanceFromHome: number;
  Education: number;
  EducationField: string;
  EmployeeCount: number;
  EmployeeNumber: number;
  EnvironmentSatisfaction: number;
  Gender: string;
  HourlyRate: number;
  JobInvolvement: number;
  JobLevel: number;
  JobRole: string;
  JobSatisfaction: number;
  MaritalStatus: string;
  MonthlyIncome: number;
  MonthlyRate: number;
  NumCompaniesWorked: number;
  Over18: string;
  OverTime: string;
  PercentSalaryHike: number;
  PerformanceRating: number;
  RelationshipSatisfaction: number;
  StandardHours: number;
  StockOptionLevel: number;
  TotalWorkingYears: number;
  TrainingTimesLastYear: number;
  WorkLifeBalance: number;
  YearsAtCompany: number;
  YearsInCurrentRole: number;
  YearsSinceLastPromotion: number;
  YearsWithCurrManager: number;
}

export interface ModelStats {
  accuracy: number;
  loss: number;
  confusionMatrix: {
    tp: number;
    fp: number;
    tn: number;
    fn: number;
  };
  precision: number;
  recall: number;
  f1Score: number;
  trainHistory: {
    loss: number[];
    acc: number[];
    val_loss: number[];
    val_acc: number[];
    // Add other possible metrics that might come from TensorFlow
    [key: string]: number[];
  };
}