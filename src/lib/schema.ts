export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          email: string;
          id: string;
          display_name: string;
          biography: string | null;
        };
        Insert: {
          email: string;
          id: string;
          display_name: string;
          biography?: string | null;
        };
        Update: {
          email?: string;
          id?: string;
          display_name?: string;
          biography?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      amazon_finds: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          url_to_product: string;
          image_url: string;
          price: string;
          profile_id: string;
        };
        Insert: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          url_to_product: string;
          image_url: string;
          price: string;
          profile_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string;
          url_to_product?: string;
          image_url?: string;
          price?: string;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "amazon_finds_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      amazon_finds_reviews: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          rating: string;
          amazon_finds_id: string;
        };
        Insert: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          rating: string;
          amazon_finds_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string;
          rating?: string;
          amazon_finds_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "amazon_finds_reviews_amazon_finds_id_fkey";
            columns: ["amazon_finds_id"];
            referencedRelation: "amazon_finds";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}