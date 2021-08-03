# Selenium integration testing

<!-- badges: start -->
[![Generic badge](https://img.shields.io/badge/<TestBadge>-<Test>-<COLOR>.svg)](https://shields.io/)#experimental)
<!-- badges: end -->

# Introduction
Integration testing is done with selenium and everything needed to test how users interact with a feature is located here.
Docker is used to launch webdrivers which can be called using python in order to mimic user behaviour. Each end to end 
feature that involves user input should be tested here. 

A good rule of thumb is to implement a test here if you find yourself manually testing an implemented feature. 

# Docker
The webdrivers are hosted in docker containers as described in [seleniumHQ](https://github.com/SeleniumHQ/docker-selenium)
and can be manipulated following the development instructions found on 
[test driven](https://testdriven.io/blog/distributed-testing-with-selenium-grid/). The idea is to use Selenium hub which
provides access to a grid containing multiple browsers, meaning out application can be tested across different browsers and
sessions concurrently. This is very powerfull and saves alot of time. 

