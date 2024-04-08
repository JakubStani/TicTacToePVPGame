variable "project_name" {
    type = string
    default = "TicTacToePVPAppServerInstance"
}
variable "vpc_cidr_block" {
    type = string
    default = "192.168.0.0/16"
}
variable "pub_sub_1_cidr" {
    type = string 
    default = "192.168.0.0/24"
}
# variable "pub_sub_2_cidr" {}
variable "priv_app_sub_1_cidr" {
    type = string 
    default = "192.168.1.0/24"
}
# variable "priv_app_sub_2_cidr" {}
# variable "priv_data_sub_1_cidr" {}
# variable "priv_data_sub_2_cidr" {}

variable "sg_http_cidr" {
    type = list(string)
    default = ["0.0.0.0/0"]
    }

variable "sg_https_cidr" {
    type = list(string)
    default = ["0.0.0.0/0"]
    }

variable "sg_tcp_cidr" {
    type = list(string)
    default = ["0.0.0.0/0"]
    }