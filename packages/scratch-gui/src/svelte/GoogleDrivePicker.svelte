<script lang="ts">
  
  const doAuth = (callback) => {
    window.gapi.auth.authorize({
        client_id: CLIENT_ID,
        scope: DRIVE_SCOPE,
        immediate: false
        },
        callback
    );
  }

  const handleClickDriveSave = () => {
    // make sure user has logged into Google Drive
    if (!this.state.authToken) {
        this.doAuth(response => {
            if (response.access_token) {
                this.handleDriveAuthenticate(response.access_token);
                this.handleClickDriveSave();
            }
        });
        this.props.onRequestCloseFile();
        return;
    }

    // check if we have already created file
    let fileId = this.state.fileId;
    if (!fileId) {
        if (this.isGoogleDriveReady()) {
            let fileName = prompt("Name your project", this.props.projectTitle);
            if (fileName != null && fileName != "") {
                window.gapi.client.drive.files.create({
                    name: fileName + ".sb3",
                    mimeType: "application/x-zip"
                }).then((response) => {
                    if (response.status == 200) {
                        this.setState({
                            fileId: response.result.id
                        });
                        this.handleClickDriveSave();
                    }
                });
            }
        }
        this.props.onRequestCloseFile();
        return;
    }

    const url = "https://www.googleapis.com/upload/drive/v3/files/" + fileId + "?uploadType=media;" + this.state.authToken;
    this.props.vm.uploadProjectToURL(url);
    
    // show alert that we are saving project
    window.alert("Project saved");
    this.props.onRequestCloseFile();
  }

  const handleDriveAuthenticate = (token) => {
      this.setState({
          authToken: token
      });
  }

  function handleDriveProjectSelect(data) {
    console.log(data);
    if (data.docs) {
        const fileId = data.docs[0].id;
        const url = "https://www.googleapis.com/drive/v3/files/" + fileId + "/?alt=media;" + this.state.authToken;
        
        const readyToReplaceProject = this.props.confirmReadyToReplaceProject(
            this.props.intl.formatMessage(sharedMessages.replaceProjectWarning)
        );

        if (readyToReplaceProject) {
            this.props.vm.downloadProjectFromURLDirect(url);
            
            this.props.onReceivedProjectTitle(this.getProjectTitleFromFilename(data.docs[0].name));
            
            // if project does not have a parentId, it's a shared project and you cannot save
            if (data.docs[0].parentId !== undefined) {
                this.setState({
                    fileId: fileId
                });
            } else {
                this.setState({
                    fileId: null
                });
            }
        }
    }
    this.props.onRequestCloseFile();
  }

  function isGoogleReady() {
    return !!window.gapi;
  }

  function isGoogleAuthReady() {
    return !!window.gapi.auth;
  }
  function isGoogleDriveReady() {
    return !!window.gapi.client.drive;
  }

  function onApiLoad() {
    window.gapi.load('auth');
    window.gapi.load('client', () => {
        window.gapi.client.load('drive', 'v3');
    });
  }

</script>