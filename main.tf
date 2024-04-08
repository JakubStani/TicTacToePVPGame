terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = "us-east-1"
}

###

resource "aws_vpc" "vpc" {

  #zakres adresów IP, przydzielanych do danej VPC
  cidr_block =var.vpc_cidr_block

  #sposób alokacji fizycznych zasobów sprzętowych,
  #na których uruchamiane są instancje EC2 wewnątrz VPC
  #(sprzęt współdzielony lub dedykowany)
  instance_tenancy="default"

  #czy instancje EC2 mają w vpc automatycznie nazwy DNS
  enable_dns_hostnames= true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

#### !!!
resource "aws_security_group" "sg" {
  name="security_group"
  vpc_id=aws_vpc.vpc.id
  description = "Allows HTTP, HTTPS, TCP"

  ingress {
    description = "HTTP"
    from_port = 80
    to_port = 80
    protocol="tcp"
    cidr_blocks=var.sg_http_cidr
  }

  ingress {
    description = "HTTPS"
    from_port = 443
    to_port = 443
    protocol="tcp"
    cidr_blocks=var.sg_https_cidr
  }

  ingress {
    description = "TCP"
    from_port = 8080
    to_port = 8080
    protocol="tcp"
    cidr_blocks=var.sg_tcp_cidr
  }

  #!!!

  egress {
    description = "HTTP"
    from_port = 80
    to_port = 80
    protocol="tcp"
    cidr_blocks=var.sg_http_cidr
  }

  egress {
    description = "HTTPS"
    from_port = 443
    to_port = 443
    protocol="tcp"
    cidr_blocks=var.sg_https_cidr
  }

  egress {
    description = "TCP"
    from_port = 8080
    to_port = 8080
    protocol="tcp"
    cidr_blocks=var.sg_tcp_cidr
  }
}
####


#do komunikacji między vpc, a internetem
resource "aws_internet_gateway" "igw" {
  vpc_id=aws_vpc.vpc.id

  tags={
    Name = "${var.project_name}-igw"
  }
}

data "aws_availability_zones" "av_zones" {}

resource "aws_subnet" "pub_sub_1" {
  vpc_id=aws_vpc.vpc.id
  cidr_block=var.pub_sub_1_cidr
  availability_zone=data.aws_availability_zones.av_zones.names[0]

  #czy nowe EC2 ma mieć automatycznie przypisany publiczny IP podczas uruchamiania
  map_public_ip_on_launch=true

  tags={
    Name = "pub_sub_1"
  }
}

# resource "aws_subnet" "pub_sub_2" {
#   vpc_id=aws_vpc.vpc.id
#   cidr_block=var.pub_sub_2_cidr
#   availability_zone=data.aws_availability_zones.av_zones.names[1]

#   #czy nowe EC2 ma mieć automatycznie przypisany publiczny IP podczas uruchamiania
#   map_public_ip_on_launch=true

#   tags={
#     Name = "pub_sub_2"
#   }
# }

#kontroluje, gdzie przekierowywany jest ruch
resource "aws_route_table" "pub_route_table" {
  vpc_id = aws_vpc.vpc.id

  route {

    #to będzie gdziekolwiek w internecie
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "pub_route_table"
  }
}

resource "aws_route_table_association" "pub_sub_1_route_tab_assoc" {
  subnet_id = aws_subnet.pub_sub_1.id
  route_table_id = aws_route_table.pub_route_table.id
}

# resource "aws_route_table_association" "pub_sub_2_route_tab_assoc" {
#   subnet_id = aws_subnet.pub_sub_2.id
#   route_table_id = aws_route_table.pub_route_table.id
# }

resource "aws_subnet" "private_app_subnet_1" {
  vpc_id =aws_vpc.vpc.id
  cidr_block =var.priv_app_sub_1_cidr
  availability_zone=data.aws_availability_zones.av_zones.names[0]
  
  #ponieważ to jest podsieć prywatna
  map_public_ip_on_launch=false

  tags = {
    Name = "priv_app_sub_1"
  }
}

# resource "aws_subnet" "private_app_subnet_2" {
#   vpc_id =aws_vpc.vpc.id
#   cidr_block =var.priv_app_sub_2_cidr
#   availability_zone=data.aws_availability_zones.av_zones.names[1]
  
#   #ponieważ to jest podsieć prywatna
#   map_public_ip_on_launch=false

#   tags = {
#     Name = "priv_app_sub_2"
#   }
# }

#!!!!
# resource "aws_subnet" 'priv_data_sub_1" {
#   vpc_id = aws_vpc.vpc.id
#   cidr_block = var.priv_data_sub_1_cidr

#   availability_zone=data.aws_availability_zones.av_zones.names[0]
#   map_public_ip_on_launch=false

#   tags = {
#     Name = "priv_data_sub_1"
#   }
# }

#!!!!
# resource "aws_subnet" 'priv_data_sub_2" {
#   vpc_id = aws_vpc.vpc.id
#   cidr_block = var.priv_data_sub_2_cidr

#   availability_zone=data.aws_availability_zones.av_zones.names[1]
#   map_public_ip_on_launch=false

#   tags = {
#     Name = "priv_data_sub_2"
#   }
# }

resource "aws_instance" "app_server" {
  ami           = "ami-051f8a213df8bc089"
  instance_type = "t2.micro"
  vpc_security_group_ids=[aws_security_group.sg.id]
  subnet_id=aws_subnet.pub_sub_1.id
  
  tags = {
    Name = var.project_name
  }
}