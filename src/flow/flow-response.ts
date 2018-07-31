export interface FlowResponse {
  access_token?: string;
  instance_url?: string;
  id?: string;
  token_type?: string;
  issued_at?: string;
  signature?: string;

  // Error
  error: string;
  error_description: string;
}
