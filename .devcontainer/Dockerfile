FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# Install dependencies for building Python 2.7
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    zlib1g-dev \
    libncurses5-dev \
    libgdbm-dev \
    libnss3-dev \
    libssl-dev \
    libreadline-dev \
    libffi-dev \
    libsqlite3-dev \
    wget \
    libbz2-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Download and compile Python 2.7.18
RUN cd /tmp && \
    wget https://www.python.org/ftp/python/2.7.18/Python-2.7.18.tgz && \
    tar xzf Python-2.7.18.tgz && \
    cd Python-2.7.18 && \
    ./configure --prefix=/usr/local && \
    make -j$(nproc) && \
    make altinstall && \
    cd / && \
    rm -rf /tmp/Python-2.7.18*

# Create symlink for python2 command
RUN ln -sf /usr/local/bin/python2.7 /usr/local/bin/python2

# Install pip for Python 2.7
RUN curl https://bootstrap.pypa.io/pip/2.7/get-pip.py --output get-pip.py && \
    /usr/local/bin/python2.7 get-pip.py && \
    rm get-pip.py

# Ensure python2 is in PATH for vscode user
RUN echo 'export PATH="/usr/local/bin:$PATH"' >> /home/vscode/.bashrc